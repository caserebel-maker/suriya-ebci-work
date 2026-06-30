# รายงานสถานะโครงการและการโอนย้ายงาน (RAKDI Course Management System)

ไฟล์นี้สรุปสถานะการพัฒนา หน้าเว็บหลักสูตรสถาบัน RAKDI (`rakdi26`) ปัญหาปัจจุบันที่พบ และขั้นตอนการนำงานไปพัฒนาต่อในเครื่องอื่น

---

## 1. สิ่งที่พัฒนาเสร็จเรียบร้อยแล้ว (Completed Features)

### 💻 โครงสร้างเว็บและการแสดงผล
- **ระบบ Data-Driven**: รายชื่อคอร์สทั้งหมดเก็บอยู่ในคลาส `COURSES` (JSON Array) ในไฟล์ `index.html` ทำให้สามารถเพิ่ม/ลด/แก้ไขหลักสูตรได้โดยการปรับข้อมูลในสคริปต์จุดเดียว
- **ระบบกรองข้อมูล (Tab Filter)**: แยกดูหลักสูตรได้ 3 ประเภท (ทั้งหมด / เปิดรับสมัคร / เสร็จสิ้นแล้ว) พร้อมการนับจำนวนอัปเดตแบบเรียลไทม์
- **กล่องรายละเอียดหลักสูตร (Slide-up Modal)**: 
  - หากหลักสูตรยังเปิดอยู่: แสดงเนื้อหา, รายชื่อวิทยากร, และปุ่มสมัครเรียนซึ่งจะ Pre-fill ข้อมูลหลักสูตรลงไปในแบบฟอร์มด้านล่างให้ทันที
  - หากหลักสูตรเสร็จสิ้นแล้ว: แสดงสรุปการสัมมนา, ภาพบรรยากาศ (Gallery Grid), และเอกสารดาวน์โหลด (PDF/XLSX)
- **หน้าแยกคลังหลักสูตรเก่า ([archive.html](archive.html))**: สร้างหน้าแยกคลังประวัติสำหรับหลักสูตรที่สัมมนาจบไปแล้วโดยเฉพาะ เชื่อมโยงกับหน้าแรก และใช้ดีไซน์สม่ำเสมอเดียวกัน

### 🎨 ดีไซน์และแบบอักษร (Design & Typography)
- **ฟอนต์ไม่มีหัวสมบูรณ์แบบ (`IBM Plex Sans Thai`)**: เปลี่ยนแบบอักษรหัวข้อและเนื้อหาทั้งหมดในเว็บให้เป็นแบบไม่มีหัวสไตล์โมเดิร์นตามที่ผู้ใช้งานต้องการ (ถอดฟอนต์ *Playfair Display* และ *IBM Plex Sans Thai Looped* ที่มีหัวออกทั้งหมด)
- **ปรับแต่งเงาการ์ดลอยตัว (Enhanced Layered Shadows)**: ปรับแก้ตัวแปรเงา `--shadow-premium` และ `--shadow-hover` ให้มีความเข้มและซ้อนกัน 2 ชั้น ทำให้การ์ดหลักสูตรดูลอยเด่นขึ้นมาจากพื้นหลังอย่างสวยงามและมีมิติ
- **ภาพแบนเนอร์สัมมนาแบบแนวนอน (Widescreen 16:9)**: เปลี่ยนภาพโปสเตอร์ 5 กูรูเป็นแบบแนวนอน ([5guru-poster.jpg](5guru-poster.jpg) ขนาด 1024x572 พิกเซล) เพื่อให้เข้ากับสัดส่วนของกล่องแสดงผล (Modal) โดยไม่โดนตัดขอบ

### ✉️ ระบบแบบอักษรและข้อมูลแบบฟอร์ม (Registration Form)
- **ปรับปรุงฟอร์มใหม่แบบละเอียด (11 ฟิลด์)**: ออกแบบฟอร์มลงทะเบียนให้เก็บข้อมูลละเอียดเพื่อใช้ประมวลผลต่อ (ชื่อ-นามสกุล, เบอร์โทร, อีเมล, Line ID, บริษัท, ตำแหน่ง, แผนก, ประเภทธุรกิจ, คอร์สที่สมัคร, ช่องทางที่รู้จัก, ความต้องการพิเศษ)
- **ระบบเชื่อมต่ออัตโนมัติ (Google Sheets Integration)**: เขียนสคริปต์ JavaScript ใน [index.html](index.html) ให้ดึงข้อมูลทั้งหมดส่งไปยัง Google Apps Script Web App เมื่อมีการกดปุ่มส่งฟอร์ม

---

## 2. ปัญหาปัจจุบันที่กำลังแก้ไข (Active Issue)

### ❌ ปัญหา: การส่งฟอร์มไปยัง Google Sheets ติดสิทธิ์การเข้าถึง (403 Forbidden / ไม่พบเพจ)
เมื่อกดส่งข้อมูลลงทะเบียนผ่านฟอร์มหน้าเว็บ หรือใช้คำสั่งยิงทดสอบไปยังลิงก์ Web App ล่าสุด:
`https://script.google.com/macros/s/AKfycbwuXaGBlUDlXTjCIUh4mm4m4MyDrQketUSL6kKBS9smlhRk1A7kgIdsH0Ds6a0Cew/exec`
ระบบของ Google Drive จะตอบกลับด้วยข้อผิดพลาด **`403 Forbidden` (ไม่สามารถเปิดไฟล์ได้ในเวลานี้)** 

#### 🔍 วิธีการหาสาเหตุและการแก้ไข:
1. **ตรวจสอบบันทึกข้อผิดพลาดใน Google Sheets**:
   - ไปที่แผ่นงาน Google Sheets ➔ ส่วนขยาย (Extensions) ➔ Apps Script
   - กดปุ่มรูปนาฬิกาด้านซ้าย **การดำเนินการ (Executions)** เพื่อดูบันทึกข้อผิดพลาดของ `doPost` สีแดง
2. **การล้างแคชบัญชีซ้อน (Account Conflict)**:
   - บ่อยครั้งที่เบราว์เซอร์ทำการล็อกอินบัญชี Google ค้างไว้หลายบัญชี (เช่น บัญชีส่วนตัว + บัญชีทำงาน) ทำให้สิทธิ์การคอมไพล์สคริปต์ของ Google ผิดพลาด
   - **วิธีแก้**: ให้เปิดเบราว์เซอร์ใน **โหมดไม่ระบุตัวตน (Incognito Window)** ➔ ล็อกอินเข้า Google Drive ด้วยจีเมลที่ใช้สร้างชีตเพียงบัญชีเดียว ➔ เข้า Apps Script แล้วทำการกด **Deploy ใหม่ (New deployment)** โดยตั้งสิทธิ์ผู้เข้าถึงเป็น **ทุกคน (Anyone)** อีกครั้ง

---

## 3. ขั้นตอนการนำงานไปใช้ต่อบนเครื่องอื่น (How to Transfer & Run)

### 🚨 คลังเก็บโค้ดที่เป็นทางการ (Source of Truth)
ก่อนทำการแก้ไขหรืออัพเดทโค้ดทุกครั้ง ให้ตรวจสอบและดึงโค้ดล่าสุดจาก GitHub Repository นี้เสมอ:
* **Repository**: `https://github.com/caserebel-maker/rakdi-landing`
* **ขั้นตอนแนะนำ**:
  1. ดึงโค้ดล่าสุดจาก Repository: `git pull`
  2. ทำการคัดลอกไฟล์หลัก (`index.html`, `styles.css`, `archive.html` และรูปภาพทั้งหมด) มาไว้ในโฟลเดอร์ `/rakdi/`
  3. ตรวจสอบสิทธิ์และอัปเดต URL ของ Google Apps Script

### 📂 ไฟล์หลักที่ต้องดูแล (Main Assets)
- [index.html](index.html) (หน้าหลัก)
- [styles.css](styles.css) (ไฟล์สไตล์หลัก)
- [archive.html](archive.html) (หน้าคลังประวัติสัมมนา)
- ภาพประกอบทั้งหมดรวมถึงแบนเนอร์และภาพพื้นหลังสัมมนา (เช่น `rakdi-milestones-logistics-bg.png`, `5guru-poster.jpg`)

### 🛠️ คำสั่งสำหรับการรันโปรเจกต์ (Terminal Commands)
1. **ติดตั้ง dependencies**:
   ```bash
   npm install
   ```
2. **คอมไพล์หน้ารวม (HTML + Inlined CSS) สำหรับ WordPress**:
   ```bash
   npm run build:rakdi
   ```
3. **การทดสอบอัปโหลดขึ้นเซิร์ฟเวอร์จริงผ่านสคริปต์ FTP**:
   ตัวสคริปต์อัปโหลดอัตโนมัติจะเก็บอยู่ในโฟลเดอร์ชั่วคราว สามารถกดสั่งรันได้ผ่านคำสั่ง:
   ```bash
   python3 scratch/deploy_static_ftp.py
   ```
   *(หมายเหตุ: ข้อมูลการเชื่อมต่อ FTP เจ้าภาพ `thsv46.hostatom.com` ถูกเขียนรหัสผ่านฝังไว้ในตัวสคริปต์ python เรียบร้อยแล้ว สามารถกดอัปโหลดได้เลย)*

### 📝 โค้ดสำหรับ Google Apps Script (ใน Google Sheets)
นำโค้ดนี้ไปแปะในหน้าสคริปต์ของ Google Sheets เพื่อรับค่าและเขียนลงบรรทัดสเปรดชีต:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  var name = e.parameter.name || "";
  var phone = e.parameter.phone || "";
  var email = e.parameter.email || "";
  var lineId = e.parameter.lineId || "";
  var company = e.parameter.company || "";
  var position = e.parameter.position || "";
  var department = e.parameter.department || "";
  var businessType = e.parameter.businessType || "";
  var course = e.parameter.course || "";
  var source = e.parameter.source || "";
  var note = e.parameter.note || "";
  
  sheet.appendRow([
    new Date(), 
    name, 
    phone, 
    email, 
    lineId, 
    company, 
    position, 
    department, 
    businessType, 
    course, 
    source, 
    note
  ]);
  
  return ContentService.createTextOutput("SUCCESS");
}
```
*หลังจากนำไปวางแล้ว ต้องกดรันหนึ่งครั้งเพื่อรับสิทธิ์เข้าถึง (Authorize) และกด Deploy ใหม่ เป็นเว็บแอปพลิเคชัน ตั้งค่าสิทธิ์เข้าถึงเป็น Everyone (ทุกคน) เสมอ*
