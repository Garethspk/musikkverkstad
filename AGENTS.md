# Musikkverkstad release requirements

For future code/content changes, run `node scripts/quality-gate.cjs`.
Never describe a BLOCKED or FAIL result as a pupil-ready release.
Code/build failures block all publication. The existing owner-private site is
a labelled development prototype: prototype publication may use
`node scripts/quality-gate.cjs --prototype` as an ordered packaging command,
provided unresolved evidence is disclosed. That flag never changes the report's
pupilRelease decision. Preserve the site's audience.

Retain the required browser, rendered-audio, real-device and independent-review
evidence checks. Do not turn an unavailable check into PASS or replace it with
mock evidence. New evidence adapters must bind results to the exact candidate
content hash and preserve the fail/blocked gate tests.

Use independent teacher/test review for changes to musical questions,
accepted answers, difficulty or pupil instructions. Give reviewers concrete
criteria and report their verification limits. Limit repair/review iterations
to two per batch; hold unresolved issues instead of releasing failed work.
