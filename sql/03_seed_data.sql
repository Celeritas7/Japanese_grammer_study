-- ============================================================
-- FILE: 03_seed_data.sql
-- Run this THIRD in Supabase SQL Editor
-- Seeds Week 1 grammar data, conjunctions, and quiz questions
-- Prefix: japanese_grammer_
-- ============================================================

-- ─── Grammar Groups ──────────────────────────────────────────────
INSERT INTO japanese_grammer_groups (id, label, week, day, custom, sort_order) VALUES
  ('appearance',  'Appearance · みたい vs らしい vs っぽい',        1, 1, false, 1),
  ('youni',       'ように · する vs なる',                          1, 4, false, 2),
  ('youni-usage', 'ように · Explanation vs Request vs Hope',        1, 5, false, 3);


-- ─── Grammar Points (Week 1) ────────────────────────────────────
INSERT INTO japanese_grammer_points
  (group_id, week, day, title, meaning, nuance, notes, formation, formation_list, examples, sort_order)
VALUES
  -- Day 1: Appearance group
  (
    'appearance', 1, 1, '〜みたい',
    'Looks like, seems like, appears to be',
    'Direct personal observation, casual',
    'More casual than ようだ. Used in spoken Japanese.',
    '{"verb": "食べる + みたい", "iAdj": "高い + みたい", "naAdj": "静か + みたい", "noun": "学生 + みたい"}',
    ARRAY['Verb plain form + みたい', 'いadj + みたい', 'なadj + みたい', 'Noun + みたい'],
    '[{"jp": "雨が降るみたいだ。", "en": "It looks like it will rain."}, {"jp": "彼は学生みたいだ。", "en": "He seems like a student."}]',
    1
  ),
  (
    'appearance', 1, 1, '〜らしい',
    'It seems that, apparently, I heard that',
    'Hearsay or indirect evidence',
    'Based on information heard from others or indirect evidence.',
    '{"verb": "食べる + らしい", "iAdj": "高い + らしい", "naAdj": "静か + らしい", "noun": "学生 + らしい"}',
    ARRAY['Verb plain form + らしい', 'いadj + らしい', 'なadj + らしい', 'Noun + らしい'],
    '[{"jp": "明日は雨らしい。", "en": "Apparently it will rain tomorrow."}, {"jp": "あの店は美味しいらしい。", "en": "I heard that restaurant is delicious."}]',
    2
  ),
  (
    'appearance', 1, 1, '〜っぽい',
    '~ish, -like, tends to be',
    'Tendency, -ish quality, slightly negative',
    'Casual. Often implies a tendency or resemblance. Can be slightly negative.',
    '{"verb": "食べ + っぽい (rare)", "iAdj": "高 + っぽい (rare)", "naAdj": "—", "noun": "子供 + っぽい"}',
    ARRAY['Verb ます stem + っぽい', 'いadj stem + っぽい', 'Noun + っぽい'],
    '[{"jp": "彼は怒りっぽい。", "en": "He tends to get angry easily."}, {"jp": "この色は白っぽい。", "en": "This color is whitish."}]',
    3
  ),

  -- Day 4: ように group
  (
    'youni', 1, 4, '〜ようにする',
    'To make an effort to, to try to',
    'Conscious effort / habit building',
    'Expresses conscious effort to create a habit or change behavior.',
    '{"verb": "食べる + ようにする", "iAdj": "—", "naAdj": "—", "noun": "—"}',
    ARRAY['Verb dictionary form + ようにする', 'Verb ない form + ようにする'],
    '[{"jp": "毎日運動するようにしています。", "en": "I make an effort to exercise every day."}, {"jp": "遅刻しないようにする。", "en": "I will try not to be late."}]',
    4
  ),
  (
    'youni', 1, 4, '〜ようになる',
    'To come to, to become able to',
    'Natural/gradual change over time',
    'Describes a gradual change in ability or state over time.',
    '{"verb": "話せる + ようになる", "iAdj": "—", "naAdj": "—", "noun": "—"}',
    ARRAY['Verb dictionary form + ようになる', 'Verb ない form + ようになる'],
    '[{"jp": "日本語が話せるようになった。", "en": "I became able to speak Japanese."}, {"jp": "朝早く起きられるようになった。", "en": "I came to be able to wake up early."}]',
    5
  ),

  -- Day 5: ように usage group
  (
    'youni-usage', 1, 5, '〜ように (Explanation)',
    'In such a way that, so that (explains manner)',
    'Manner/way (non-volitional verbs)',
    'Used with non-volitional verbs like 見える, 聞こえる.',
    '{"verb": "見える + ように", "iAdj": "—", "naAdj": "—", "noun": "Noun + の + ように"}',
    ARRAY['Verb plain form + ように', 'Noun + の + ように'],
    '[{"jp": "後ろにいる学生に見えるように大きく書く。", "en": "Write big so students in the back can see."}]',
    6
  ),
  (
    'youni-usage', 1, 5, '〜ように (Request)',
    'Please do ~ (polite request/instruction)',
    'Polite instruction, softer command',
    'Softer than a direct command. Often used with ください.',
    '{"verb": "忘れない + ように", "iAdj": "—", "naAdj": "—", "noun": "—"}',
    ARRAY['Verb plain form + ように', 'Verb ない form + ように'],
    '[{"jp": "忘れないようにメモを取ってください。", "en": "Please take notes so you don''t forget."}]',
    7
  ),
  (
    'youni-usage', 1, 5, '〜ように (Hope)',
    'I hope that ~, I pray that ~',
    'Wish / prayer / hope',
    'Used for wishes, often at shrines or when expressing hopes.',
    '{"verb": "受かります + ように", "iAdj": "—", "naAdj": "—", "noun": "—"}',
    ARRAY['Verb ます + ように', 'Verb ません + ように'],
    '[{"jp": "試験に受かりますように。", "en": "I hope I pass the exam."}, {"jp": "雨が降りませんように。", "en": "I hope it doesn''t rain."}]',
    8
  );


-- ─── Conjunctions ────────────────────────────────────────────────
INSERT INTO japanese_grammer_conjunctions (kana, kanji, meaning, sort_order) VALUES
  ('けれども', '',   'But (Formal)',                    1),
  ('しかし',   '',   'But (Spoken)',                    2),
  ('でも',     '',   'But (Casual)',                    3),
  ('が',       '',   'But (Written/Spoken, Formal)',    4),
  ('じつは',   '実は', 'Actually',                      5),
  ('すると',   '',   'Then',                            6),
  ('そして',   '',   'And then',                        7),
  ('それから', '',   'After that',                      8),
  ('それに',   '',   'In addition',                     9),
  ('ですから', '',   'So',                              10),
  ('ところが', '',   'However',                         11),
  ('ところで', '',   'By the way',                      12),
  ('もし',     '',   'If',                              13);


-- ─── Quiz Questions ──────────────────────────────────────────────
INSERT INTO japanese_grammer_quiz_questions (group_id, question, options, correct_index, question_type) VALUES
  (
    'appearance',
    '雨が降る＿＿だ。 (It looks like it will rain.)',
    ARRAY['みたい', 'らしい', 'っぽい', 'ように'],
    0, 'fill_blank'
  ),
  (
    'appearance',
    '明日は雨＿＿。 (Apparently it will rain tomorrow.)',
    ARRAY['みたいだ', 'らしい', 'っぽい', 'ようだ'],
    1, 'fill_blank'
  ),
  (
    'appearance',
    '彼は怒り＿＿。 (He tends to get angry easily.)',
    ARRAY['みたい', 'らしい', 'っぽい', 'ようだ'],
    2, 'fill_blank'
  ),
  (
    'youni',
    '日本語が話せる＿＿なった。 (I became able to speak Japanese.)',
    ARRAY['ように', 'みたいに', 'らしく', 'っぽく'],
    0, 'fill_blank'
  ),
  (
    'youni',
    '毎日運動する＿＿しています。 (I make an effort to exercise daily.)',
    ARRAY['ために', 'ように', 'みたいに', 'らしく'],
    1, 'fill_blank'
  ),
  (
    'youni-usage',
    '試験に受かり＿＿。 (I hope I pass the exam.)',
    ARRAY['ますように', 'たいです', 'みたいです', 'らしいです'],
    0, 'fill_blank'
  );
