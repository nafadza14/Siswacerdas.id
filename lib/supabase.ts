
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aabelzkzwcbyfgkynrvd.supabase.co';
const supabaseAnonKey = 'sb_publishable_FK_OsFW2T8zKAJ7265Iing_NM5WpAe2';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
