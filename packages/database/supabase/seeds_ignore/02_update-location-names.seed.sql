-- Silly migration file that goes through and randomly assigns more meaningful looking names into the nameless locations
-- todo : just add names to the seed data

-- Step 1: Update locations where street contains facility-type keywords
UPDATE locations
SET name = CASE
  -- Handle park names
  WHEN street ILIKE '%park%' THEN
    INITCAP(REGEXP_REPLACE(street, '\s+(drive|road|street|avenue|lane|court|circle|way|boulevard|trail|path).*$', '', 'i'))

  -- Handle golf facilities
  WHEN street ILIKE '%golf%' THEN
    INITCAP(REGEXP_REPLACE(street, '\s+(drive|road|street|avenue|lane|court|circle|way|boulevard).*$', '', 'i')) ||
    CASE WHEN street ILIKE '%golf%course%' OR street ILIKE '%golf%club%' THEN '' ELSE ' Golf Course' END

  -- Handle trails and paths
  WHEN street ILIKE '%trail%' OR street ILIKE '%path%' THEN
    INITCAP(REGEXP_REPLACE(street, '\s+(drive|road|street|avenue|lane|court|circle|way|boulevard).*$', '', 'i'))

  -- Handle explicit sports facilities
  WHEN street ILIKE '%sports%' OR street ILIKE '%athletic%' OR street ILIKE '%field%' OR street ILIKE '%stadium%' THEN
    INITCAP(REGEXP_REPLACE(street, '\s+(drive|road|street|avenue|lane|court|circle|way|boulevard).*$', '', 'i')) ||
    CASE WHEN street ILIKE '%sports%' OR street ILIKE '%athletic%' OR street ILIKE '%complex%' THEN '' ELSE ' Sports Complex' END

  -- Handle schools
  WHEN street ILIKE '%school%' OR street ILIKE '%elementary%' OR street ILIKE '%high%' OR street ILIKE '%middle%' THEN
    INITCAP(REGEXP_REPLACE(street, '\s+(drive|road|street|avenue|lane|court|circle|way|boulevard).*$', '', 'i')) || ' Athletic Center'

  -- Handle recreation facilities
  WHEN street ILIKE '%recreation%' OR street ILIKE '%rec%' THEN
    INITCAP(REGEXP_REPLACE(street, '\s+(drive|road|street|avenue|lane|court|circle|way|boulevard).*$', '', 'i'))
END
WHERE name IS NULL
  AND (street ILIKE '%park%'
       OR street ILIKE '%golf%'
       OR street ILIKE '%trail%'
       OR street ILIKE '%path%'
       OR street ILIKE '%sports%'
       OR street ILIKE '%athletic%'
       OR street ILIKE '%field%'
       OR street ILIKE '%stadium%'
       OR street ILIKE '%school%'
       OR street ILIKE '%elementary%'
       OR street ILIKE '%high%'
       OR street ILIKE '%middle%'
       OR street ILIKE '%recreation%'
       OR street ILIKE '%rec%');

-- Step 2: Update remaining locations with NULL names using generic strategy
UPDATE locations
SET name = CASE
  -- Create names based on street + facility type
  WHEN street IS NOT NULL THEN
    INITCAP(REGEXP_REPLACE(street, '\s+(drive|road|street|avenue|lane|court|circle|way|boulevard|trail|path).*$', '', 'i')) ||
    CASE
      WHEN street ILIKE '%court%' OR street ILIKE '%circle%' THEN ' Sports Complex'
      WHEN street ILIKE '%drive%' OR street ILIKE '%lane%' THEN ' Recreation Center'
      WHEN street ILIKE '%road%' OR street ILIKE '%street%' THEN ' Athletic Center'
      WHEN street ILIKE '%avenue%' OR street ILIKE '%boulevard%' THEN ' Sports Complex'
      WHEN street ILIKE '%way%' THEN ' Recreation Area'
      ELSE ' Sports Center'
    END
  -- Fallback for locations without street names
  ELSE
    CASE
      WHEN city IS NOT NULL AND city != county THEN INITCAP(city) || ' Sports Complex'
      WHEN county IS NOT NULL THEN INITCAP(county) || ' Recreation Center'
      WHEN state IS NOT NULL THEN INITCAP(state) || ' Athletic Facility'
      ELSE 'Community Sports Center'
    END
END
WHERE name IS NULL;

-- Step 3: Update locations with poor names (like "#1", "Field #2", etc.)
UPDATE locations
SET name = CASE
  WHEN street IS NOT NULL THEN
    INITCAP(REGEXP_REPLACE(street, '\s+(drive|road|street|avenue|lane|court|circle|way|boulevard|trail|path).*$', '', 'i')) ||
    CASE
      WHEN street ILIKE '%court%' OR street ILIKE '%circle%' THEN ' Sports Complex'
      WHEN street ILIKE '%drive%' OR street ILIKE '%lane%' THEN ' Recreation Center'
      WHEN street ILIKE '%road%' OR street ILIKE '%street%' THEN ' Athletic Center'
      WHEN street ILIKE '%avenue%' OR street ILIKE '%boulevard%' THEN ' Sports Complex'
      WHEN street ILIKE '%way%' THEN ' Recreation Area'
      ELSE ' Sports Center'
    END
  ELSE
    CASE
      WHEN city IS NOT NULL AND city != county THEN INITCAP(city) || ' Sports Complex'
      WHEN county IS NOT NULL THEN INITCAP(county) || ' Recreation Center'
      WHEN state IS NOT NULL THEN INITCAP(state) || ' Athletic Facility'
      ELSE 'Community Sports Center'
    END
END
WHERE name IS NOT NULL
  AND (name LIKE '#%'
       OR name LIKE '%#%'
       OR name ILIKE 'field %'
       OR name ILIKE 'diamond %'
       OR name ILIKE 'court %'
       OR name = '1'
       OR name = '2'
       OR name = '3'
       OR name = '4'
       OR name = '5');

-- Step 4: Clean up any extra spaces and formatting issues
UPDATE locations
SET name = REGEXP_REPLACE(name, '\s+', ' ', 'g')
WHERE name IS NOT NULL;

-- Step 5: Handle edge cases with redundant "County" text
UPDATE locations
SET name = CASE
  WHEN name ILIKE '%county recreation center%' THEN REPLACE(name, ' County Recreation Center', ' Recreation Center')
  WHEN name ILIKE '%county sports complex%' THEN REPLACE(name, ' County Sports Complex', ' Sports Complex')
  WHEN name ILIKE '%county athletic center%' THEN REPLACE(name, ' County Athletic Center', ' Athletic Center')
  WHEN name ILIKE '%county sports center%' THEN REPLACE(name, ' County Sports Center', ' Sports Center')
  WHEN name ILIKE '%county recreation area%' THEN REPLACE(name, ' County Recreation Area', ' Recreation Area')
  ELSE name
END
WHERE name IS NOT NULL
  AND (name ILIKE '%county%recreation%center%'
       OR name ILIKE '%county%sports%complex%'
       OR name ILIKE '%county%athletic%center%'
       OR name ILIKE '%county%sports%center%'
       OR name ILIKE '%county%recreation%area%');

-- Step 6: Fix specific cases where the generated name might be too generic
UPDATE locations
SET name = CASE
  -- Fix overly generic names
  WHEN name = 'North Sports Center' THEN 'North Community Sports Center'
  WHEN name = 'South Sports Center' THEN 'South Community Sports Center'
  WHEN name = 'East Sports Center' THEN 'East Community Sports Center'
  WHEN name = 'West Sports Center' THEN 'West Community Sports Center'
  WHEN name = 'Main Sports Center' THEN 'Main Street Sports Center'
  WHEN name = '1st Sports Center' THEN 'First Street Sports Center'
  WHEN name = '2nd Sports Center' THEN 'Second Street Sports Center'
  WHEN name = '3rd Sports Center' THEN 'Third Street Sports Center'

  -- Fix names that might be confusing
  WHEN name ILIKE '%highway%' AND name NOT ILIKE '%sports%' AND name NOT ILIKE '%recreation%' AND name NOT ILIKE '%athletic%' THEN
    name || ' Sports Center'

  ELSE name
END
WHERE name IS NOT NULL;

-- Step 7: Ensure names are properly capitalized and formatted
UPDATE locations
SET name = INITCAP(TRIM(name))
WHERE name IS NOT NULL;
