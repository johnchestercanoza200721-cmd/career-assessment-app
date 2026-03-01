#!/usr/bin/env python3
import re

file_path = 'views/results.ejs'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for Top 3 section
top3_start = '    <div class="top-three-section">'
intensity_start = '    <div class="glass-section">\n        <h3 style="margin: 0 0 20px 0; font-size: 0.9rem; text-align: center; color: var(--text-muted); text-transform: uppercase;">Interest Intensity Profile</h3>'

# Find positions
top3_pos = content.find(top3_start)
intensity_pos = content.find(intensity_start)

if top3_pos == -1 or intensity_pos == -1:
    print("Could not find sections")
    exit(1)

# Find the end of Top 3 section (closing </div>)
top3_end = content.find('    </div>', top3_pos + len(top3_start))
# Look for the actual end of the glass-section div for Interest
intensity_end = content.find('    </div>', intensity_pos + len(intensity_start))
intensity_end_final = content.find('\n\n\n', intensity_end)

# Extract sections
before = content[:top3_pos]
top3_section = content[top3_pos:top3_end + len('    </div>')]
middle_blank = content[top3_end + len('    </div>'):intensity_pos]
intensity_section = content[intensity_pos:intensity_end_final]
after = content[intensity_end_final:]

# Reorder
new_content = before + intensity_section + middle_blank + top3_section + after

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Sections reordered successfully!")
