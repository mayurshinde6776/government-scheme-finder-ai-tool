-- =============================================================================
-- 001_init.sql
-- Initial schema for the Government Scheme Eligibility Finder
--
-- Requires: pgvector extension (image: pgvector/pgvector:pg16)
-- Run via: npm run migrate
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- ---------------------------------------------------------------------------
-- 1. Custom ENUM types
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE scheme_category AS ENUM (
    'agriculture',
    'housing',
    'education',
    'health',
    'social_welfare',
    'employment',
    'women_children'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE caste_category AS ENUM (
    'general',
    'obc',
    'sc',
    'st'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- 2. Table: schemes
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schemes (
  id                 UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  name               VARCHAR(255)    NOT NULL,
  ministry           VARCHAR(255)    NOT NULL,
  category           scheme_category NOT NULL,
  -- NULL  → central (nation-wide) scheme
  -- value → state-specific scheme
  state              VARCHAR(100)    NULL,
  description        TEXT            NOT NULL,
  eligibility_text   TEXT            NOT NULL,
  benefits_text      TEXT            NOT NULL,
  documents_required TEXT[]          NOT NULL DEFAULT '{}',
  apply_url          VARCHAR(500)    NOT NULL,
  -- 384-dim vector produced by all-MiniLM-L6-v2 (or equivalent)
  embedding          vector(384)     NULL,
  is_active          BOOLEAN         NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_schemes_updated_at ON schemes;
CREATE TRIGGER trg_schemes_updated_at
  BEFORE UPDATE ON schemes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Table: user_profiles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
  id              UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id      VARCHAR(128)    NOT NULL,
  state           VARCHAR(100)    NOT NULL,
  age             INTEGER         NOT NULL CHECK (age > 0 AND age < 130),
  gender          VARCHAR(20)     NOT NULL,
  caste_category  caste_category  NOT NULL,
  income_annual   INTEGER         NOT NULL CHECK (income_annual >= 0),
  occupation      VARCHAR(100)    NOT NULL,
  is_disabled     BOOLEAN         NOT NULL DEFAULT FALSE,
  has_bpl_card    BOOLEAN         NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Index to quickly look up all profiles belonging to a browser session
CREATE INDEX IF NOT EXISTS idx_user_profiles_session_id
  ON user_profiles (session_id);

-- ---------------------------------------------------------------------------
-- 4. Table: eligibility_results
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS eligibility_results (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id   UUID        NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
  scheme_id    UUID        NOT NULL REFERENCES schemes (id) ON DELETE CASCADE,
  match_score  FLOAT       NOT NULL CHECK (match_score BETWEEN 0 AND 1),
  match_reason TEXT        NOT NULL,
  matched_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast lookup: all results for a given profile
CREATE INDEX IF NOT EXISTS idx_eligibility_results_profile_id
  ON eligibility_results (profile_id);

-- Fast lookup: all profiles matched to a particular scheme
CREATE INDEX IF NOT EXISTS idx_eligibility_results_scheme_id
  ON eligibility_results (scheme_id);

-- Prevent duplicate (profile, scheme) entries
CREATE UNIQUE INDEX IF NOT EXISTS uq_eligibility_profile_scheme
  ON eligibility_results (profile_id, scheme_id);

-- ---------------------------------------------------------------------------
-- 5. HNSW index on schemes.embedding for fast ANN search
--    ef_construction=64 and m=16 are good defaults for 384-dim vectors.
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_schemes_embedding_hnsw
  ON schemes
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- ---------------------------------------------------------------------------
-- 6. Additional helper indexes on schemes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_schemes_category
  ON schemes (category);

CREATE INDEX IF NOT EXISTS idx_schemes_state
  ON schemes (state);

CREATE INDEX IF NOT EXISTS idx_schemes_is_active
  ON schemes (is_active);
