-- CallCenterX schema for Dolt (MySQL-compatible)
-- Run this against your Dolt database after `dolt sql` or via the server on startup.

CREATE TABLE IF NOT EXISTS profiles (
  id         VARCHAR(36) NOT NULL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL DEFAULT '',
  last_name  VARCHAR(100) NOT NULL DEFAULT '',
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS organizations (
  id         VARCHAR(36) NOT NULL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  slug       VARCHAR(255) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_organizations (
  user_id         VARCHAR(36) NOT NULL,
  organization_id VARCHAR(36) NOT NULL,
  role            VARCHAR(50) NOT NULL DEFAULT 'member',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, organization_id),
  FOREIGN KEY (user_id)         REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agents (
  id              VARCHAR(36) NOT NULL PRIMARY KEY,
  organization_id VARCHAR(36) NOT NULL,
  name            VARCHAR(255) NOT NULL,
  email           VARCHAR(255),
  status          VARCHAR(50) NOT NULL DEFAULT 'offline',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS calls (
  id              VARCHAR(36) NOT NULL PRIMARY KEY,
  organization_id VARCHAR(36) NOT NULL,
  agent_id        VARCHAR(36),
  direction       VARCHAR(20) NOT NULL DEFAULT 'inbound',
  status          VARCHAR(50) NOT NULL DEFAULT 'active',
  caller_number   VARCHAR(50),
  duration_seconds INT NOT NULL DEFAULT 0,
  sentiment_score FLOAT,
  started_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at        DATETIME,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  FOREIGN KEY (agent_id)        REFERENCES agents(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS call_events (
  id         VARCHAR(36) NOT NULL PRIMARY KEY,
  call_id    VARCHAR(36) NOT NULL,
  type       VARCHAR(50) NOT NULL,
  payload    TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (call_id) REFERENCES calls(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS knowledge_bases (
  id              VARCHAR(36) NOT NULL PRIMARY KEY,
  organization_id VARCHAR(36) NOT NULL,
  name            VARCHAR(255) NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS documents (
  id               VARCHAR(36) NOT NULL PRIMARY KEY,
  knowledge_base_id VARCHAR(36) NOT NULL,
  title            VARCHAR(255) NOT NULL,
  content          LONGTEXT,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (knowledge_base_id) REFERENCES knowledge_bases(id) ON DELETE CASCADE
);
