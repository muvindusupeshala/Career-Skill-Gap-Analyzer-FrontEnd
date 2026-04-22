
$file = "src/components/CareerPathMapping.js"
$content = Get-Content $file -Raw
$content = $content -replace "import React, \{ useState \} from `"react`";", "import React, { useState, useEffect } from `"react`";`nimport { getAllCareerPaths } from `"../api`";"
$content = $content -replace "(?sm)const careers = \[.*?\n\];", ""
$content = $content -replace "export default function CareerPathMapping\(\{ navigate, assessmentData \}\) \{", "export default function CareerPathMapping({ navigate, assessmentData }) {`n  const [careers, setCareers] = useState([]);`n  const [loading, setLoading] = useState(true);`n`n  useEffect(() => {`n    getAllCareerPaths().then(data => {`n      const formatted = data.map((c, i) => ({`n        id: c._id || i,`n        title: c.title,`n        icon: c.title.includes(`"Engineer`") ? `"`" : `"`",`n        color: `"var(--primary)`",`n        desc: c.description || c.title,`n        requiredSkills: c.requiredSkills?.reduce((acc, s) => ({...acc, [s.skillName]: s.requiredLevel}), {}) || {},`n        salary: c.typicalSalaryRange || `"N/A`",`n        demand: c.demand || `"High`",`n        growth: c.growth || `"+0%`"`n      }));`n      setCareers(formatted);`n      setLoading(false);`n    });`n  }, []);`n`n  if (loading) return <div style={{ color: `"white`", padding: `"40px`", textAlign: `"center`" }}>Loading Career Paths from DB...</div>;"
Set-Content $file $content

