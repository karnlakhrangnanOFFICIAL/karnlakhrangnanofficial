const fs = require('fs');
let content = fs.readFileSync('match-detail.html', 'utf-8');
content = content.replace('</style>', `
    .events-timeline::before { display: none !important; }
    .events-timeline { padding-left: 0 !important; margin-left: 0 !important; }
  </style>
`);
fs.writeFileSync('match-detail.html', content);
