const fs = require('fs');
const file = 'data/fixtures.json';
let fixtures = JSON.parse(fs.readFileSync(file, 'utf8'));
const matchIndex = fixtures.findIndex(m => m.id === 'm9');

if (matchIndex !== -1) {
    fixtures[matchIndex].commentary = [
        {
            "section": "📌 3 ประเด็นสำคัญจากการแข่งขัน (Key Takeaways)",
            "events": [
                {
                    "minute": "1",
                    "text": "<strong>การพลิกเกมอย่างแข็งแกร่งของอาร์เซน่อล (Arsenal's Resilient Comeback)</strong><br>• เสียประตูเร็วตั้งแต่ต้นเกม: เชลซีได้ประตูขึ้นนำ 0-1 ในนาทีที่ 2 จาก Morgan Rogers<br>• ถูก VAR ริบประตูคืน: อาร์เซน่อลเกือบได้ประตูตีเสมอในนาทีที่ 13 จาก Riccardo Calafiori แต่ถูก VAR ยกเลิก<br>• ตั้งสติและพลิกกลับมาเอาชนะ: Kai Havertz ยิงประตูตีเสมอ 1-1 ในนาทีที่ 24 ก่อนที่ Martin Ødegaard จะยิงประตูชัย 2-1 ในนาทีที่ 49 จากจังหวะสวนกลับเร็ว"
                },
                {
                    "minute": "2",
                    "text": "<strong>ประสิทธิภาพในการสร้างโอกาสทำประตู (Attacking Dominance)</strong><br>• อาร์เซน่อลสร้างโอกาสยิงได้ทั้งหมด 17 ครั้ง ขณะที่เชลซีทำได้ 13 ครั้ง<br>• อาร์เซน่อลได้ลูกเตะมุม 5 ครั้ง เปรียบเทียบกับเชลซี 3 ครั้ง ซึ่งสะท้อนถึงการครองเกมกดดันในพื้นที่แดนหน้าอย่างต่อเนื่อง"
                },
                {
                    "minute": "3",
                    "text": "<strong>ความเข้มข้นและการปะทะในเกม (Match Intensity & Discipline)</strong><br>• มีการทำฟาวล์เกิดขึ้นรวม 29 ครั้ง (เชลซี ทำฟาวล์ 16 ครั้ง, อาร์เซน่อล ทำฟาวล์ 13 ครั้ง)<br>• ผู้ตัดสินชูใบเหลืองรวม 6 ใบ โดยแบ่งเป็น เชลซี 4 ใบ (João Pedro 15', Cole Palmer 45', Maxence Lacroix 58', Morgan Rogers 87') และ อาร์เซน่อล 2 ใบ (Christos Tzolis 58', Mikel Merino 90'+5')"
                }
            ]
        },
        {
            "section": "⏱️ ลำดับเหตุการณ์สำคัญ (Match Timeline)",
            "events": [
                { "minute": "2'", "text": "⚽ <strong>ประตู! (0-1):</strong> Morgan Rogers (Chelsea) ยิงด้วยขวาจากนอกกรอบเขตโทษเข้ามุมซ้ายล่าง (แอสซิสต์โดย Jorrel Hato)" },
                { "minute": "13'", "text": "❌ <strong>VAR Overturned:</strong> ประตูของ Riccardo Calafiori (Arsenal) ถูกยกเลิกโดย VAR" },
                { "minute": "15'", "text": "🟨 <strong>ใบเหลือง:</strong> João Pedro (Chelsea)" },
                { "minute": "24'", "text": "⚽ <strong>ประตู! (1-1):</strong> Kai Havertz (Arsenal) ยิงด้วยซ้ายจากนอกกรอบเขตโทษเสียบมุมขวาล่าง (แอสซิสต์โดย Declan Rice)" },
                { "minute": "45'", "text": "🟨 <strong>ใบเหลือง:</strong> Cole Palmer (Chelsea)" },
                { "minute": "45'+5", "text": "⏸️ <strong>จบครึ่งแรก:</strong> อาร์เซน่อล 1 - 1 เชลซี" },
                { "minute": "49'", "text": "⚽ <strong>ประตู! (2-1):</strong> Martin Ødegaard (Arsenal) ยิงด้วยซ้ายจากกลางกรอบเขตโทษเข้าเสาสูง จากจังหวะสวนกลับเร็ว (แอสซิสต์โดย Christos Tzolis)" },
                { "minute": "58'", "text": "🟨 <strong>ใบเหลือง:</strong> Maxence Lacroix (Chelsea) และ Christos Tzolis (Arsenal)" },
                { "minute": "60'", "text": "🔄 <strong>เปลี่ยนตัว (Chelsea):</strong> Pep Chavarría แทน Jorrel Hato / Malo Gusto แทน Roméo Lavia" },
                { "minute": "67'", "text": "🔄 <strong>เปลี่ยนตัว (Arsenal):</strong> Piero Hincapié แทน Riccardo Calafiori" },
                { "minute": "69'", "text": "🔄 <strong>เปลี่ยนตัว (Arsenal):</strong> Martín Zubimendi แทน Myles Lewis-Skelly" },
                { "minute": "77'", "text": "🔄 <strong>เปลี่ยนตัว (Arsenal):</strong> Mikel Merino แทน Martin Ødegaard" },
                { "minute": "79'", "text": "🔄 <strong>เปลี่ยนตัว (Arsenal):</strong> Viktor Gyökeres แทน Kai Havertz" },
                { "minute": "82'", "text": "🔄 <strong>เปลี่ยนตัว (Chelsea):</strong> Estêvão แทน Pedro Neto" },
                { "minute": "87'", "text": "🟨 <strong>ใบเหลือง:</strong> Morgan Rogers (Chelsea)" },
                { "minute": "88'", "text": "🔄 <strong>เปลี่ยนตัว (Chelsea):</strong> Danny Welbeck แทน Morgan Rogers" },
                { "minute": "90'", "text": "🔄 <strong>เปลี่ยนตัว (Arsenal):</strong> Noni Madueke แทน Bukayo Saka" },
                { "minute": "90'+5", "text": "🟨 <strong>ใบเหลือง:</strong> Mikel Merino (Arsenal)" },
                { "minute": "FT", "text": "🏁 <strong>จบเกม:</strong> อาร์เซน่อล ชนะ เชลซี 2 - 1" }
            ]
        }
    ];
    fs.writeFileSync(file, JSON.stringify(fixtures, null, 2));
    console.log("m9 commentary updated.");
}
