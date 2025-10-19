-- GSC Data Storage Schema

CREATE TABLE IF NOT EXISTS gsc_properties (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  property_url VARCHAR(255) NOT NULL,
  property_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, property_url)
);

CREATE TABLE IF NOT EXISTS gsc_search_data (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES gsc_properties(id),
  page VARCHAR(500) NOT NULL,
  query VARCHAR(500) NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  avg_position DECIMAL(5, 2) DEFAULT 0,
  ctr DECIMAL(5, 2) DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES gsc_properties(id) ON DELETE CASCADE,
  UNIQUE(property_id, page, query, date)
);

CREATE TABLE IF NOT EXISTS seo_recommendations (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES gsc_properties(id),
  type VARCHAR(50) NOT NULL, -- 'page_optimization', 'new_article', 'keyword_opportunity'
  target_page VARCHAR(500),
  target_query VARCHAR(500),
  recommendation TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'implemented', 'dismissed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES gsc_properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_tokens (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expiry TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gsc_search_data_property ON gsc_search_data(property_id);
CREATE INDEX idx_gsc_search_data_date ON gsc_search_data(date);
CREATE INDEX idx_recommendations_property ON seo_recommendations(property_id);
CREATE INDEX idx_recommendations_status ON seo_recommendations(status);
