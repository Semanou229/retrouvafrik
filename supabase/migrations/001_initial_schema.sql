-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create announcements table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('person', 'animal', 'object')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  disappearance_date DATE NOT NULL,
  last_location JSONB NOT NULL,
  urgency VARCHAR(10) NOT NULL DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'archived')),
  photos TEXT[] DEFAULT '{}',
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  contact_other TEXT,
  contact_visibility VARCHAR(20) NOT NULL DEFAULT 'members_only' CHECK (contact_visibility IN ('public', 'members_only')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reports table (signalements)
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('seen', 'information', 'other')),
  description TEXT NOT NULL,
  location TEXT,
  date TEXT,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_announcements_type ON announcements(type);
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_urgency ON announcements(urgency);
CREATE INDEX idx_announcements_user_id ON announcements(user_id);
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX idx_comments_announcement_id ON comments(announcement_id);
CREATE INDEX idx_reports_announcement_id ON reports(announcement_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for announcements
CREATE POLICY "Anyone can view active announcements"
  ON announcements FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can create announcements"
  ON announcements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own announcements"
  ON announcements FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own announcements"
  ON announcements FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for reports
CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM announcements WHERE id = reports.announcement_id
  ));

CREATE POLICY "Anyone can create reports"
  ON reports FOR INSERT
  WITH CHECK (true);

