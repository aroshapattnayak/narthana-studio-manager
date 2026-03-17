import { useState, useEffect, useCallback, useRef } from "react";

// ── Fonts ─────────────────────────────────────────────────────────────────────
const fl = document.createElement("link");
fl.rel = "stylesheet";
fl.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap";
document.head.appendChild(fl);

// ── Colors ────────────────────────────────────────────────────────────────────
const C = {
  cream:"#fdf8f0", a50:"#fffbeb", a100:"#fef3c7", a200:"#fde68a",
  a400:"#fbbf24", a500:"#f59e0b", a600:"#d97706", a700:"#b45309",
  b700:"#92400e", b800:"#78350f", b900:"#451a03",
  white:"#ffffff", g300:"#d4c5b0", g500:"#8b7355", g700:"#4a3728",
};

// ── Utilities ─────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const fmt$ = n => `$${Number(n).toFixed(2)}`;
const fmtD = d => new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
const thisMonth = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; };

// ── Firestore helpers ─────────────────────────────────────────────────────────
const db = () => window.db;
const fsSet = (col, id, data) => { try { db()?.collection(col).doc(id).set(data); } catch(e) { console.error("Firestore write error", e); } };
const fsDel = (col, id) => { try { db()?.collection(col).doc(id).delete(); } catch(e) { console.error("Firestore delete error", e); } };

// ── Seed data ─────────────────────────────────────────────────────────────────
const STUDENTS0 = [
  {id:"s1",name:"Arishka Gedam",parentName:"Mrugla Gedam",email:"",phone:"",fee:120.0,active:true},
  {id:"s2",name:"Tanishka Karuppusamy",parentName:"Mohan Karuppusamy",email:"",phone:"",fee:60,active:true},
  {id:"s3",name:"Shriya Sajja",parentName:"Vanitha Sajja",email:"",phone:"",fee:120.0,active:true},
  {id:"s4",name:"Niharika Rekulakunta",parentName:"Reddi Rekulakunta",email:"",phone:"",fee:120.0,active:true},
  {id:"s5",name:"Keerthi Gunde",parentName:"Jyothi Gunde",email:"",phone:"",fee:120.0,active:true},
  {id:"s6",name:"Chahana Chittemreddy",parentName:"Chandrakala Chittemreddy",email:"",phone:"",fee:120.0,active:true},
  {id:"s7",name:"Shivani Jayabharathi",parentName:"Susitha Jayabharathi",email:"",phone:"",fee:120.0,active:true},
  {id:"s8",name:"Khyathi Undralla",parentName:"Krishna Undralla",email:"",phone:"",fee:150.0,active:true},
  {id:"s9",name:"Yazhini Arun Raja",parentName:"Malathy Arun Raja",email:"",phone:"",fee:150.0,active:true},
  {id:"s10",name:"Aadhya Mummineni",parentName:"Hima Bindu Mummineni",email:"",phone:"",fee:150.0,active:true},
  {id:"s11",name:"Akshara Amara",parentName:"Vasavi Sathya Saranya Lakshmi Amara",email:"",phone:"",fee:150.0,active:true},
  {id:"s12",name:"Anagha Mavinakere",parentName:"Lakshmi Manivakere",email:"",phone:"",fee:150.0,active:true},
  {id:"s13",name:"Aarushi Kasi",parentName:"Sharanya Kasi",email:"",phone:"",fee:150.0,active:true},
  {id:"s14",name:"Shyla Enjamuri",parentName:"Swetha Enjamuri",email:"",phone:"",fee:150.0,active:true},
  {id:"s15",name:"Srimanvi Ganji",parentName:"Jyothsna Ganji",email:"",phone:"",fee:150.0,active:true},
  {id:"s16",name:"Mokshi Kokku",parentName:"Hari Kokku",email:"",phone:"",fee:150.0,active:true},
  {id:"s17",name:"Venba Renganathan",parentName:"Karthikeyan Renganathan",email:"",phone:"",fee:150.0,active:true},
  {id:"s18",name:"Vidita Bumireddy",parentName:"Chandrasudh Bumireddy",email:"",phone:"",fee:150.0,active:true},
  {id:"s19",name:"Niya Burugula",parentName:"Pallavi Burugula",email:"",phone:"",fee:150.0,active:true},
  {id:"s20",name:"Smaya Reddy Karra",parentName:"Tarun Reddy Karra",email:"",phone:"",fee:150.0,active:true},
  {id:"s21",name:"Inchara Bangera",parentName:"Lokesh Bangera",email:"",phone:"",fee:150.0,active:true},
  {id:"s22",name:"Mahil Kuppusamy",parentName:"Birundha Kuppusamy",email:"",phone:"",fee:150.0,active:true},
  {id:"s23",name:"Sreshtha Beeram",parentName:"Swetha Beeram",email:"",phone:"",fee:150.0,active:true},
  {id:"s24",name:"Indu Polisetty",parentName:"Prathap Polisetty",email:"",phone:"",fee:150.0,active:true},
  {id:"s25",name:"Misha Narayana Reddy",parentName:"Muruli Narayana Reddy",email:"",phone:"",fee:150.0,active:true},
  {id:"s26",name:"Sanvika Murali",parentName:"Swathi Murali",email:"",phone:"",fee:150.0,active:true},
  {id:"s27",name:"Riddhima Jayini",parentName:"Haritha Jayini",email:"",phone:"",fee:150.0,active:true},
  {id:"s28",name:"Aashritha Gandra",parentName:"Mythili Gandra",email:"",phone:"",fee:150.0,active:true},
  {id:"s29",name:"Tanvi Mannam",parentName:"Udaya Mannam",email:"",phone:"",fee:75.0,active:true},
  {id:"s30",name:"Chaithra Vennapusala",parentName:"Prameela Vennapusala",email:"",phone:"",fee:75.0,active:true},
  {id:"s31",name:"Manjuri Hanchate",parentName:"Praveen Hanchate",email:"",phone:"",fee:75.0,active:true},
  {id:"s32",name:"Varshini Sankranthi",parentName:"Bhagya Sankranthi",email:"",phone:"",fee:75.0,active:true},
  {id:"s33",name:"Poojitha Vetcha",parentName:"Purnachandra Vetcha",email:"",phone:"",fee:75.0,active:true},
  {id:"s34",name:"Ellakhiya Parameshwaran",parentName:"Jagadeesh Parameshwaran/ Maheshwari Jagadeeshkumar",email:"",phone:"",fee:75.0,active:true},
  {id:"s35",name:"Nadhi Arthanari",parentName:"Poorani Arthanari",email:"",phone:"",fee:75.0,active:false},
  {id:"s36",name:"Diya Palaniswamy",parentName:"Sandhya Palaniswamy",email:"",phone:"",fee:75.0,active:true},
  {id:"s37",name:"Sudhiksha Chevva",parentName:"Sneha Latha Chevva",email:"",phone:"",fee:75.0,active:true},
  {id:"s38",name:"Samanvi Uppala",parentName:"Madhavi Uppala",email:"",phone:"",fee:75.0,active:true},
  {id:"s39",name:"Dithya Bondala",parentName:"Nalini Bondala",email:"",phone:"",fee:75.0,active:true},
  {id:"s40",name:"Tanvi Bondala",parentName:"Nalini Bondala",email:"",phone:"",fee:75.0,active:true},
  {id:"s41",name:"Rushika Ankavvagari",parentName:"Sushma Ankavvagari",email:"",phone:"",fee:75.0,active:true},
  {id:"s44",name:"Myra Variketi",parentName:"Naga Deepthi Variketi",email:"",phone:"",fee:75.0,active:true},
  {id:"s45",name:"Siddhi Variketi",parentName:"Naga Deepthi Variketi",email:"",phone:"",fee:75.0,active:true},
  {id:"s48",name:"Sarayu Mettu",parentName:"Ram",email:"",phone:"",fee:75.0,active:true},
  {id:"s51",name:"Stuti Venkatesh",parentName:"Mangala Jyothi Venkatesh",email:"",phone:"",fee:75.0,active:true},
  {id:"s52",name:"Anuhya Gangu",parentName:"Varchaswini Gangu",email:"",phone:"",fee:75.0,active:true},
  {id:"s53",name:"Maha Veerla",parentName:"Thirupathi Veerla",email:"",phone:"",fee:75.0,active:true},
  {id:"s54",name:"Sanvi Gali",parentName:"Ramakrishna Gali",email:"",phone:"",fee:75.0,active:true},
  {id:"s55",name:"Meghna Vetcha",parentName:"Purnachandra Vetcha",email:"",phone:"",fee:75.0,active:true},
  {id:"s56",name:"Aadya Macharla",parentName:"Venkata Macharla",email:"",phone:"",fee:75.0,active:true},
  {id:"s57",name:"Ashrita Ramani",parentName:"Madan Ramani",email:"",phone:"",fee:75.0,active:false},
  {id:"s58",name:"Veda Yadavali",parentName:"Vinaysimha Yadavalli",email:"",phone:"",fee:75.0,active:true},
  {id:"s59",name:"Jahnvi Pasupulati",parentName:"Bhanushree Pasupulati",email:"",phone:"",fee:75.0,active:true},
  {id:"s60",name:"Aarna Kotapati",parentName:"Sandhya Kotapati",email:"",phone:"",fee:75.0,active:true},
  {id:"s61",name:"Kiara Alle",parentName:"Vikas Alle",email:"",phone:"",fee:75.0,active:true},
  {id:"s62",name:"Bhuvika Ganji",parentName:"Sandhya Ganji",email:"",phone:"",fee:75.0,active:true},
  {id:"s63",name:"Srinika Jonna",parentName:"Venkatakrishnai Jonna",email:"",phone:"",fee:75.0,active:true},
  {id:"s64",name:"Ghanishka Jonna",parentName:"Venkatakrishnai Jonna",email:"",phone:"",fee:75.0,active:true},
  {id:"s65",name:"Bhavishya Pendli",parentName:"Naga Satya Naresh Pendli",email:"",phone:"",fee:75.0,active:true},
  {id:"s66",name:"Rithanya Padmanaban",parentName:"Lakshmi G Padmanaban",email:"",phone:"",fee:75.0,active:true},
  {id:"s67",name:"Ashrita Ramesh Mandan",parentName:"Smruthi Ramesh",email:"",phone:"",fee:75.0,active:true},
{id:"s68",name:"Anika Snehal",parentName:"Gayathri Snehal",email:"",phone:"",fee:75,active:true}
];
const PAYMENTS0 = [
  {id:"p1",sid:"s10",amount:150.0,date:"2025-09-02",method:"Zelle",status:"paid",note:""},
  {id:"p8",sid:"s15",amount:150.0,date:"2025-09-04",method:"Zelle",status:"paid",note:""},
  {id:"p3",sid:"s9",amount:150.0,date:"2025-09-07",method:"Zelle",status:"paid",note:""},
  {id:"p4",sid:"s11",amount:150.0,date:"2025-09-07",method:"Zelle",status:"paid",note:""},
  {id:"p5",sid:"s12",amount:150.0,date:"2025-09-07",method:"Zelle",status:"paid",note:""},
  {id:"p9",sid:"s16",amount:150.0,date:"2025-09-07",method:"Zelle",status:"paid",note:""},
  {id:"p36",sid:"s35",amount:75.0,date:"2025-09-07",method:"Zelle",status:"paid",note:""},
  {id:"p37",sid:"s36",amount:75.0,date:"2025-09-07",method:"Zelle",status:"paid",note:""},
  {id:"p38",sid:"s26",amount:150.0,date:"2025-09-07",method:"Zelle",status:"paid",note:""},
  {id:"p40",sid:"s23",amount:150.0,date:"2025-09-07",method:"Zelle",status:"paid",note:""},
  {id:"p42",sid:"s34",amount:75.0,date:"2025-09-07",method:"Zelle",status:"paid",note:""},
  {id:"p2",sid:"s8",amount:150.0,date:"2025-09-08",method:"Cash",status:"paid",note:""},
  {id:"p33",sid:"s6",amount:120.0,date:"2025-09-08",method:"Zelle",status:"paid",note:""},
  {id:"p34",sid:"s40",amount:75.0,date:"2025-09-08",method:"Zelle",status:"paid",note:""},
  {id:"p35",sid:"s39",amount:75.0,date:"2025-09-08",method:"Zelle",status:"paid",note:""},
  {id:"p41",sid:"s28",amount:150.0,date:"2025-09-09",method:"Zelle",status:"paid",note:""},
  {id:"p7",sid:"s14",amount:150.0,date:"2025-09-10",method:"Zelle",status:"paid",note:""},
  {id:"p31",sid:"s27",amount:150.0,date:"2025-09-10",method:"Zelle",status:"paid",note:""},
  {id:"p32",sid:"s14",amount:150.0,date:"2025-09-10",method:"Zelle",status:"paid",note:""},
  {id:"p26",sid:"s3",amount:140.0,date:"2025-09-11",method:"Zelle",status:"paid",note:"Paid + 20 for competition"},
  {id:"p27",sid:"s22",amount:150.0,date:"2025-09-11",method:"Zelle",status:"paid",note:""},
  {id:"p28",sid:"s45",amount:75.0,date:"2025-09-11",method:"Zelle",status:"paid",note:""},
  {id:"p29",sid:"s44",amount:75.0,date:"2025-09-11",method:"Zelle",status:"paid",note:""},
  {id:"p30",sid:"s51",amount:75.0,date:"2025-09-11",method:"Zelle",status:"paid",note:""},
  {id:"p22",sid:"s54",amount:75.0,date:"2025-09-12",method:"Zelle",status:"paid",note:""},
  {id:"p23",sid:"s53",amount:75.0,date:"2025-09-12",method:"Zelle",status:"paid",note:""},
  {id:"p24",sid:"s52",amount:75.0,date:"2025-09-12",method:"Zelle",status:"paid",note:""},
  {id:"p25",sid:"s41",amount:75.0,date:"2025-09-12",method:"Zelle",status:"paid",note:""},
  {id:"p39",sid:"s48",amount:75.0,date:"2025-09-12",method:"Zelle",status:"paid",note:""},
  {id:"p44",sid:"s4",amount:120.0,date:"2025-09-12",method:"Cash",status:"paid",note:""},
  {id:"p46",sid:"s57",amount:75.0,date:"2025-09-12",method:"Zelle",status:"paid",note:""},
  {id:"p6",sid:"s13",amount:150.0,date:"2025-09-14",method:"Zelle",status:"paid",note:""},
  {id:"p20",sid:"s5",amount:140.0,date:"2025-09-14",method:"Zelle",status:"paid",note:"Paid + 20 for competition"},
  {id:"p21",sid:"s25",amount:150.0,date:"2025-09-14",method:"Zelle",status:"paid",note:""},
  {id:"p16",sid:"s21",amount:150.0,date:"2025-09-15",method:"Zelle",status:"paid",note:""},
  {id:"p17",sid:"s2",amount:100.0,date:"2025-09-15",method:"Zelle",status:"paid",note:""},
  {id:"p18",sid:"s31",amount:75.0,date:"2025-09-15",method:"Zelle",status:"paid",note:""},
  {id:"p19",sid:"s1",amount:140.0,date:"2025-09-15",method:"Zelle",status:"paid",note:"Paid + 20 for competition"},
  {id:"p43",sid:"s7",amount:120.0,date:"2025-09-15",method:"Check",status:"paid",note:""},
  {id:"p45",sid:"s56",amount:75.0,date:"2025-09-15",method:"Zelle",status:"paid",note:""},
  {id:"p12",sid:"s19",amount:150.0,date:"2025-09-16",method:"Zelle",status:"paid",note:""},
  {id:"p13",sid:"s20",amount:150.0,date:"2025-09-16",method:"Zelle",status:"paid",note:""},
  {id:"p15",sid:"s18",amount:150.0,date:"2025-09-16",method:"Zelle",status:"paid",note:""},
  {id:"p11",sid:"s24",amount:150.0,date:"2025-09-17",method:"Zelle",status:"paid",note:""},
  {id:"p10",sid:"s32",amount:75.0,date:"2025-09-24",method:"Zelle",status:"paid",note:""},
  {id:"p48",sid:"s60",amount:75.0,date:"2025-09-24",method:"Zelle",status:"paid",note:""},
  {id:"p54",sid:"s59",amount:75.0,date:"2025-09-24",method:"Zelle",status:"paid",note:""},
  {id:"p49",sid:"s30",amount:75.0,date:"2025-09-25",method:"Zelle",status:"paid",note:""},
  {id:"p50",sid:"s55",amount:75.0,date:"2025-09-25",method:"Zelle",status:"paid",note:""},
  {id:"p51",sid:"s33",amount:75.0,date:"2025-09-25",method:"Zelle",status:"paid",note:""},
  {id:"p52",sid:"s3",amount:75.0,date:"2025-09-28",method:"Zelle",status:"paid",note:""},
  {id:"p47",sid:"s58",amount:75.0,date:"2025-09-30",method:"Zelle",status:"paid",note:""},
  {id:"p55",sid:"s61",amount:75.0,date:"2025-09-30",method:"Zelle",status:"paid",note:""},
  {id:"p14",sid:"s20",amount:150.0,date:"2025-10-01",method:"Zelle",status:"paid",note:""},
  {id:"p53",sid:"s9",amount:150.0,date:"2025-10-01",method:"Zelle",status:"paid",note:""},
  {id:"p56",sid:"s11",amount:150.0,date:"2025-10-01",method:"Zelle",status:"paid",note:""},
  {id:"p57",sid:"s26",amount:150.0,date:"2025-10-02",method:"Zelle",status:"paid",note:""},
  {id:"p59",sid:"s22",amount:100.0,date:"2025-10-02",method:"Zelle",status:"paid",note:""},
  {id:"p60",sid:"s12",amount:150.0,date:"2025-10-02",method:"Zelle",status:"paid",note:""},
  {id:"p58",sid:"s2",amount:120.0,date:"2025-10-03",method:"Zelle",status:"paid",note:""},
  {id:"p61",sid:"s27",amount:150.0,date:"2025-10-05",method:"Zelle",status:"paid",note:""},
  {id:"p62",sid:"s34",amount:75.0,date:"2025-10-05",method:"Zelle",status:"paid",note:""},
  {id:"p63",sid:"s39",amount:75.0,date:"2025-10-05",method:"Zelle",status:"paid",note:""},
  {id:"p64",sid:"s40",amount:75.0,date:"2025-10-05",method:"Zelle",status:"paid",note:""},
  {id:"p65",sid:"s36",amount:75.0,date:"2025-10-05",method:"Zelle",status:"paid",note:""},
  {id:"p66",sid:"s21",amount:150.0,date:"2025-10-05",method:"Zelle",status:"paid",note:""},
  {id:"p67",sid:"s28",amount:150.0,date:"2025-10-05",method:"Zelle",status:"paid",note:""},
  {id:"p68",sid:"s24",amount:150.0,date:"2025-10-05",method:"Zelle",status:"paid",note:""},
  {id:"p69",sid:"s23",amount:150.0,date:"2025-10-05",method:"Zelle",status:"paid",note:""},
  {id:"p70",sid:"s31",amount:75.0,date:"2025-10-06",method:"Zelle",status:"paid",note:""},
  {id:"p71",sid:"s10",amount:150.0,date:"2025-10-06",method:"Zelle",status:"paid",note:""},
  {id:"p72",sid:"s25",amount:150.0,date:"2025-10-06",method:"Zelle",status:"paid",note:""},
  {id:"p73",sid:"s15",amount:150.0,date:"2025-10-06",method:"Zelle",status:"paid",note:""},
  {id:"p92",sid:"s7",amount:120.0,date:"2025-10-06",method:"Check",status:"paid",note:""},
  {id:"p93",sid:"s8",amount:150.0,date:"2025-10-06",method:"Cash",status:"paid",note:""},
  {id:"p74",sid:"s14",amount:250.0,date:"2025-10-08",method:"Zelle",status:"paid",note:"100 for costume"},
  {id:"p75",sid:"s13",amount:150.0,date:"2025-10-08",method:"Zelle",status:"paid",note:"100 for costume"},
  {id:"p76",sid:"s51",amount:75.0,date:"2025-10-09",method:"Zelle",status:"paid",note:""},
  {id:"p77",sid:"s41",amount:75.0,date:"2025-10-09",method:"Zelle",status:"paid",note:""},
  {id:"p78",sid:"s52",amount:75.0,date:"2025-10-10",method:"Zelle",status:"paid",note:""},
  {id:"p79",sid:"s57",amount:75.0,date:"2025-10-10",method:"Zelle",status:"paid",note:""},
  {id:"p81",sid:"s56",amount:75.0,date:"2025-10-10",method:"Zelle",status:"paid",note:""},
  {id:"p162",sid:"s67",amount:75.0,date:"2025-10-10",method:"Zelle",status:"paid",note:""},
  {id:"p80",sid:"s53",amount:75.0,date:"2025-10-11",method:"Zelle",status:"paid",note:""},
  {id:"p82",sid:"s48",amount:75.0,date:"2025-10-11",method:"Zelle",status:"paid",note:""},
  {id:"p83",sid:"s35",amount:75.0,date:"2025-10-11",method:"Zelle",status:"paid",note:""},
  {id:"p84",sid:"s44",amount:75.0,date:"2025-10-11",method:"Zelle",status:"paid",note:""},
  {id:"p85",sid:"s45",amount:75.0,date:"2025-10-11",method:"Zelle",status:"paid",note:""},
  {id:"p86",sid:"s54",amount:75.0,date:"2025-10-12",method:"Zelle",status:"paid",note:""},
  {id:"p87",sid:"s6",amount:105.0,date:"2025-10-13",method:"Zelle",status:"paid",note:"missed class"},
  {id:"p94",sid:"s4",amount:120.0,date:"2025-10-13",method:"Cash",status:"paid",note:""},
  {id:"p88",sid:"s29",amount:225.0,date:"2025-10-14",method:"Zelle",status:"paid",note:"Aug Sep Oct fees"},
  {id:"p89",sid:"s18",amount:150.0,date:"2025-10-15",method:"Zelle",status:"paid",note:""},
  {id:"p91",sid:"s62",amount:150.0,date:"2025-10-15",method:"Zelle",status:"paid",note:"Sep & Oct fees"},
  {id:"p98",sid:"s63",amount:75.0,date:"2025-10-23",method:"Zelle",status:"paid",note:""},
  {id:"p95",sid:"s37",amount:75.0,date:"2025-10-26",method:"Zelle",status:"paid",note:""},
  {id:"p96",sid:"s38",amount:75.0,date:"2025-10-26",method:"Zelle",status:"paid",note:""},
  {id:"p97",sid:"s64",amount:75.0,date:"2025-10-26",method:"Zelle",status:"paid",note:""},
  {id:"p108",sid:"s20",amount:150.0,date:"2025-10-26",method:"Zelle",status:"paid",note:""},
  {id:"p109",sid:"s20",amount:150.0,date:"2025-10-26",method:"Zelle",status:"paid",note:""},
  {id:"p99",sid:"s32",amount:75.0,date:"2025-10-27",method:"Zelle",status:"paid",note:""},
  {id:"p123",sid:"s5",amount:120.0,date:"2025-10-27",method:"Zelle",status:"paid",note:""},
  {id:"p124",sid:"s30",amount:75.0,date:"2025-10-27",method:"Zelle",status:"paid",note:""},
  {id:"p110",sid:"s60",amount:75.0,date:"2025-10-28",method:"Zelle",status:"paid",note:""},
  {id:"p111",sid:"s59",amount:75.0,date:"2025-10-28",method:"Zelle",status:"paid",note:""},
  {id:"p142",sid:"s65",amount:75.0,date:"2025-10-29",method:"Zelle",status:"paid",note:""},
  {id:"p100",sid:"s55",amount:75.0,date:"2025-10-30",method:"Zelle",status:"paid",note:""},
  {id:"p103",sid:"s55",amount:75.0,date:"2025-10-30",method:"Zelle",status:"paid",note:""},
  {id:"p104",sid:"s33",amount:75.0,date:"2025-10-30",method:"Zelle",status:"paid",note:""},
  {id:"p105",sid:"s33",amount:75.0,date:"2025-10-30",method:"Zelle",status:"paid",note:""},
  {id:"p106",sid:"s21",amount:150.0,date:"2025-11-01",method:"Zelle",status:"paid",note:""},
  {id:"p112",sid:"s24",amount:150.0,date:"2025-11-01",method:"Zelle",status:"paid",note:""},
  {id:"p156",sid:"s24",amount:150.0,date:"2025-11-01",method:"Zelle",status:"paid",note:""},
  {id:"p119",sid:"s61",amount:75.0,date:"2025-11-02",method:"Zelle",status:"paid",note:""},
  {id:"p120",sid:"s61",amount:75.0,date:"2025-11-02",method:"Zelle",status:"paid",note:""},
  {id:"p121",sid:"s17",amount:150.0,date:"2025-11-02",method:"Zelle",status:"paid",note:""},
  {id:"p122",sid:"s17",amount:150.0,date:"2025-11-02",method:"Zelle",status:"paid",note:""},
  {id:"p118",sid:"s9",amount:150.0,date:"2025-11-03",method:"Zelle",status:"paid",note:""},
  {id:"p113",sid:"s58",amount:75.0,date:"2025-11-04",method:"Zelle",status:"paid",note:""},
  {id:"p114",sid:"s58",amount:75.0,date:"2025-11-04",method:"Zelle",status:"paid",note:""},
  {id:"p115",sid:"s10",amount:150.0,date:"2025-11-04",method:"Zelle",status:"paid",note:""},
  {id:"p116",sid:"s11",amount:150.0,date:"2025-11-04",method:"Zelle",status:"paid",note:""},
  {id:"p117",sid:"s15",amount:150.0,date:"2025-11-04",method:"Cash",status:"paid",note:""},
  {id:"p126",sid:"s58",amount:75.0,date:"2025-11-04",method:"Cash",status:"paid",note:""},
  {id:"p127",sid:"s58",amount:75.0,date:"2025-11-04",method:"Zelle",status:"paid",note:""},
  {id:"p128",sid:"s44",amount:75.0,date:"2025-11-05",method:"Zelle",status:"paid",note:""},
  {id:"p129",sid:"s45",amount:75.0,date:"2025-11-05",method:"Zelle",status:"paid",note:""},
  {id:"p131",sid:"s30",amount:75.0,date:"2025-11-05",method:"Zelle",status:"paid",note:""},
  {id:"p132",sid:"s19",amount:150.0,date:"2025-11-05",method:"Zelle",status:"paid",note:""},
  {id:"p133",sid:"s19",amount:150.0,date:"2025-11-05",method:"Zelle",status:"paid",note:""},
  {id:"p134",sid:"s59",amount:75.0,date:"2025-11-05",method:"Zelle",status:"paid",note:""},
  {id:"p135",sid:"s12",amount:150.0,date:"2025-11-05",method:"Zelle",status:"paid",note:""},
  {id:"p136",sid:"s51",amount:75.0,date:"2025-11-05",method:"Zelle",status:"paid",note:""},
  {id:"p137",sid:"s52",amount:75.0,date:"2025-11-05",method:"Zelle",status:"paid",note:""},
  {id:"p138",sid:"s31",amount:75.0,date:"2025-11-05",method:"Zelle",status:"paid",note:""},
  {id:"p139",sid:"s53",amount:75.0,date:"2025-11-05",method:"Zelle",status:"paid",note:""},
  {id:"p161",sid:"s67",amount:75.0,date:"2025-11-05",method:"Zelle",status:"paid",note:""},
  {id:"p140",sid:"s18",amount:150.0,date:"2025-11-06",method:"Zelle",status:"paid",note:""},
  {id:"p141",sid:"s3",amount:120.0,date:"2025-11-06",method:"Zelle",status:"paid",note:""},
  {id:"p145",sid:"s56",amount:75.0,date:"2025-11-06",method:"Zelle",status:"paid",note:""},
  {id:"p147",sid:"s48",amount:75.0,date:"2025-11-06",method:"Zelle",status:"paid",note:""},
  {id:"p148",sid:"s54",amount:75.0,date:"2025-11-06",method:"Zelle",status:"paid",note:""},
  {id:"p158",sid:"s66",amount:75.0,date:"2025-11-06",method:"Zelle",status:"paid",note:""},
  {id:"p146",sid:"s41",amount:75.0,date:"2025-11-07",method:"Zelle",status:"paid",note:""},
  {id:"p149",sid:"s28",amount:150.0,date:"2025-11-07",method:"Zelle",status:"paid",note:""},
  {id:"p150",sid:"s26",amount:150.0,date:"2025-11-07",method:"Zelle",status:"paid",note:""},
  {id:"p151",sid:"s26",amount:150.0,date:"2025-11-07",method:"Zelle",status:"paid",note:"Salangai Puja Fees"},
  {id:"p152",sid:"s28",amount:150.0,date:"2025-11-07",method:"Zelle",status:"paid",note:"Salangai Puja Fees"},
  {id:"p153",sid:"s23",amount:150.0,date:"2025-11-08",method:"Zelle",status:"paid",note:""},
  {id:"p154",sid:"s23",amount:150.0,date:"2025-11-08",method:"Zelle",status:"paid",note:"Salangai Puja Fees"},
  {id:"p155",sid:"s24",amount:150.0,date:"2025-11-08",method:"Zelle",status:"paid",note:"Salangai Puja Fees"},
  {id:"p168",sid:"s22",amount:100.0,date:"2025-11-08",method:"Zelle",status:"paid",note:""},
  {id:"p143",sid:"s65",amount:75.0,date:"2025-11-09",method:"Zelle",status:"paid",note:""},
  {id:"p157",sid:"s36",amount:75.0,date:"2025-11-09",method:"Zelle",status:"paid",note:""},
  {id:"p159",sid:"s8",amount:150.0,date:"2025-11-09",method:"Cash",status:"paid",note:""},
  {id:"p160",sid:"s7",amount:120.0,date:"2025-11-09",method:"Check",status:"paid",note:""},
  {id:"p173",sid:"s6",amount:120.0,date:"2025-11-11",method:"Zelle",status:"paid",note:""},
  {id:"p130",sid:"s27",amount:150.0,date:"2025-11-12",method:"Zelle",status:"paid",note:""},
  {id:"p169",sid:"s63",amount:75.0,date:"2025-11-12",method:"Zelle",status:"paid",note:""},
  {id:"p170",sid:"s64",amount:75.0,date:"2025-11-12",method:"Zelle",status:"paid",note:""},
  {id:"p171",sid:"s25",amount:150.0,date:"2025-11-12",method:"Zelle",status:"paid",note:""},
  {id:"p172",sid:"s25",amount:150.0,date:"2025-11-12",method:"Zelle",status:"paid",note:""},
  {id:"p166",sid:"s60",amount:75.0,date:"2025-11-15",method:"Zelle",status:"paid",note:""},
  {id:"p167",sid:"s22",amount:150.0,date:"2025-11-15",method:"Zelle",status:"paid",note:"salangai puja fees"},
  {id:"p163",sid:"s13",amount:150.0,date:"2025-11-20",method:"Zelle",status:"paid",note:""},
  {id:"p164",sid:"s39",amount:75.0,date:"2025-11-20",method:"Zelle",status:"paid",note:""},
  {id:"p165",sid:"s40",amount:75.0,date:"2025-11-20",method:"Zelle",status:"paid",note:""},
  {id:"p185",sid:"s16",amount:150.0,date:"2025-11-30",method:"Zelle",status:"paid",note:""},
  {id:"p174",sid:"s11",amount:150.0,date:"2025-12-01",method:"Zelle",status:"paid",note:""},
  {id:"p175",sid:"s14",amount:150.0,date:"2025-12-02",method:"Zelle",status:"paid",note:""},
  {id:"p176",sid:"s14",amount:150.0,date:"2025-12-02",method:"Zelle",status:"paid",note:""},
  {id:"p177",sid:"s9",amount:150.0,date:"2025-12-02",method:"Zelle",status:"paid",note:""},
  {id:"p178",sid:"s15",amount:150.0,date:"2025-12-02",method:"Zelle",status:"paid",note:""},
  {id:"p179",sid:"s5",amount:120.0,date:"2025-12-03",method:"Zelle",status:"paid",note:""},
  {id:"p180",sid:"s5",amount:120.0,date:"2025-12-03",method:"Zelle",status:"paid",note:""},
  {id:"p181",sid:"s12",amount:150.0,date:"2025-12-03",method:"Zelle",status:"paid",note:""},
  {id:"p182",sid:"s62",amount:75.0,date:"2025-12-04",method:"Zelle",status:"paid",note:""},
  {id:"p183",sid:"s51",amount:75.0,date:"2025-12-04",method:"Zelle",status:"paid",note:""},
  {id:"p184",sid:"s27",amount:150.0,date:"2025-12-05",method:"Zelle",status:"paid",note:""},
  {id:"p186",sid:"s16",amount:150.0,date:"2025-12-08",method:"Zelle",status:"paid",note:""},
  {id:"p187",sid:"s16",amount:150.0,date:"2025-12-08",method:"Zelle",status:"paid",note:""},
  {id:"p188",sid:"s10",amount:150.0,date:"2025-12-08",method:"Zelle",status:"paid",note:""},
  {id:"p189",sid:"s26",amount:150.0,date:"2025-12-08",method:"Zelle",status:"paid",note:""},
  {id:"p190",sid:"s25",amount:95.0,date:"2025-12-08",method:"Zelle",status:"paid",note:""},
  {id:"p191",sid:"s45",amount:37.5,date:"2025-12-08",method:"Zelle",status:"paid",note:""},
  {id:"p192",sid:"s44",amount:37.5,date:"2025-12-08",method:"Zelle",status:"paid",note:""},
  {id:"p193",sid:"s65",amount:37.5,date:"2025-12-08",method:"Zelle",status:"paid",note:""},
  {id:"p194",sid:"s62",amount:75.0,date:"2025-12-08",method:"Zelle",status:"paid",note:""},
  {id:"p195",sid:"s28",amount:94.0,date:"2025-12-09",method:"Zelle",status:"paid",note:""},
  {id:"p196",sid:"s31",amount:75.0,date:"2025-12-09",method:"Zelle",status:"paid",note:""},
  {id:"p197",sid:"s61",amount:75.0,date:"2025-12-09",method:"Zelle",status:"paid",note:""},
  {id:"p198",sid:"s56",amount:75.0,date:"2025-12-11",method:"Zelle",status:"paid",note:""},
  {id:"p199",sid:"s54",amount:75.0,date:"2025-12-11",method:"Zelle",status:"paid",note:""},
  {id:"p200",sid:"s32",amount:75.0,date:"2025-12-11",method:"Zelle",status:"paid",note:""},
  {id:"p201",sid:"s41",amount:75.0,date:"2025-12-11",method:"Zelle",status:"paid",note:""},
  {id:"p202",sid:"s66",amount:75.0,date:"2025-12-11",method:"Zelle",status:"paid",note:""},
  {id:"p203",sid:"s53",amount:75.0,date:"2025-12-11",method:"Zelle",status:"paid",note:""},
  {id:"p204",sid:"s22",amount:75.0,date:"2025-12-12",method:"Zelle",status:"paid",note:""},
  {id:"p205",sid:"s36",amount:75.0,date:"2025-12-14",method:"Zelle",status:"paid",note:""},
  {id:"p206",sid:"s30",amount:75.0,date:"2025-12-14",method:"Zelle",status:"paid",note:""},
  {id:"p207",sid:"s40",amount:75.0,date:"2025-12-14",method:"Zelle",status:"paid",note:""},
  {id:"p208",sid:"s39",amount:75.0,date:"2025-12-14",method:"Zelle",status:"paid",note:""},
  {id:"p209",sid:"s48",amount:75.0,date:"2025-12-14",method:"Zelle",status:"paid",note:""},
  {id:"p210",sid:"s37",amount:75.0,date:"2025-12-14",method:"Zelle",status:"paid",note:""},
  {id:"p211",sid:"s67",amount:37.5,date:"2025-12-14",method:"Zelle",status:"paid",note:"half for dec"},
  {id:"p232",sid:"s59",amount:75.0,date:"2026-01-02",method:"Zelle",status:"paid",note:""},
  {id:"p229",sid:"s9",amount:150.0,date:"2026-01-03",method:"Zelle",status:"paid",note:""},
  {id:"p230",sid:"s12",amount:150.0,date:"2026-01-03",method:"Zelle",status:"paid",note:""},
  {id:"p231",sid:"s15",amount:150.0,date:"2026-01-03",method:"Zelle",status:"paid",note:""},
  {id:"p226",sid:"s2",amount:90.0,date:"2026-01-04",method:"Zelle",status:"paid",note:""},
  {id:"p224",sid:"s10",amount:150.0,date:"2026-01-05",method:"Zelle",status:"paid",note:""},
  {id:"p225",sid:"s23",amount:150.0,date:"2026-01-05",method:"Zelle",status:"paid",note:""},
  {id:"p227",sid:"s8",amount:150.0,date:"2026-01-05",method:"Cash",status:"paid",note:""},
  {id:"p228",sid:"s11",amount:150.0,date:"2026-01-05",method:"Cash",status:"paid",note:""},
  {id:"p222",sid:"s60",amount:75.0,date:"2026-01-06",method:"Zelle",status:"paid",note:""},
  {id:"p223",sid:"s25",amount:150.0,date:"2026-01-06",method:"Zelle",status:"paid",note:""},
  {id:"p220",sid:"s21",amount:150.0,date:"2026-01-07",method:"Zelle",status:"paid",note:""},
  {id:"p221",sid:"s27",amount:150.0,date:"2026-01-07",method:"Zelle",status:"paid",note:""},
  {id:"p218",sid:"s53",amount:75.0,date:"2026-01-08",method:"Zelle",status:"paid",note:""},
  {id:"p219",sid:"s51",amount:75.0,date:"2026-01-08",method:"Zelle",status:"paid",note:""},
  {id:"p215",sid:"s45",amount:75.0,date:"2026-01-10",method:"Zelle",status:"paid",note:""},
  {id:"p216",sid:"s66",amount:75.0,date:"2026-01-10",method:"Zelle",status:"paid",note:""},
  {id:"p217",sid:"s31",amount:75.0,date:"2026-01-10",method:"Zelle",status:"paid",note:""},
  {id:"p212",sid:"s67",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p213",sid:"s65",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p214",sid:"s44",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p233",sid:"s52",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p234",sid:"s34",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p235",sid:"s38",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p236",sid:"s54",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p237",sid:"s30",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p238",sid:"s36",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p239",sid:"s37",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p240",sid:"s5",amount:120.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p241",sid:"s56",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p242",sid:"s39",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p243",sid:"s40",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p244",sid:"s61",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p245",sid:"s33",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
  {id:"p246",sid:"s55",amount:75.0,date:"2026-01-11",method:"Zelle",status:"paid",note:""},
{id:"9ggmp0v",sid:"s8",amount:150,date:"2026-03-05",method:"Cash",status:"paid",note:""},
{id:"pm001",sid:"s12",amount:150,date:"2026-03-02",method:"Zelle",status:"paid",note:""},
{id:"pm002",sid:"s9",amount:150,date:"2026-03-04",method:"Zelle",status:"paid",note:""},
{id:"pm003",sid:"s15",amount:150,date:"2026-03-04",method:"Zelle",status:"paid",note:""},
{id:"pm004",sid:"s6",amount:105,date:"2026-03-04",method:"Zelle",status:"paid",note:""},
{id:"pm005",sid:"s10",amount:150,date:"2026-03-05",method:"Zelle",status:"paid",note:""},
{id:"pm006",sid:"s11",amount:150,date:"2026-03-05",method:"Zelle",status:"paid",note:""},
{id:"pm007",sid:"s26",amount:150,date:"2026-03-05",method:"Zelle",status:"paid",note:""},
{id:"pm008",sid:"s51",amount:75,date:"2026-03-05",method:"Zelle",status:"paid",note:""},
{id:"pm009",sid:"s28",amount:150,date:"2026-03-05",method:"Zelle",status:"paid",note:""},
{id:"pm010",sid:"s53",amount:75,date:"2026-03-06",method:"Zelle",status:"paid",note:""},
{id:"pm011",sid:"s24",amount:150,date:"2026-03-07",method:"Zelle",status:"paid",note:""},
{id:"pm012",sid:"s26",amount:24,date:"2026-03-08",method:"Zelle",status:"paid",note:""},
{id:"pm013",sid:"s27",amount:150,date:"2026-03-08",method:"Zelle",status:"paid",note:""},
{id:"pm014",sid:"s25",amount:174,date:"2026-03-08",method:"Zelle",status:"paid",note:""},
{id:"pm015",sid:"s22",amount:124,date:"2026-03-08",method:"Zelle",status:"paid",note:""},
{id:"pm016",sid:"s23",amount:174,date:"2026-03-08",method:"Zelle",status:"paid",note:""},
{id:"pm017",sid:"s23",amount:8,date:"2026-03-08",method:"Zelle",status:"paid",note:"partial - see screenshot"},
{id:"pm018",sid:"s22",amount:8,date:"2026-03-08",method:"Zelle",status:"paid",note:""},
{id:"pm019",sid:"s26",amount:8,date:"2026-03-08",method:"Zelle",status:"paid",note:""},
{id:"pm020",sid:"s31",amount:75,date:"2026-03-09",method:"Zelle",status:"paid",note:""},
{id:"pm021",sid:"s68",amount:75,date:"2026-03-01",method:"Zelle",status:"paid",note:""},
{id:"pm022",sid:"s33",amount:75,date:"2026-03-09",method:"Zelle",status:"paid",note:"split from Purnachandra $150"},
{id:"pm023",sid:"s55",amount:75,date:"2026-03-09",method:"Zelle",status:"paid",note:"split from Purnachandra $150"},
{id:"pm024",sid:"s32",amount:60,date:"2026-03-09",method:"Zelle",status:"paid",note:"$15 short of $75 fee"},
{id:"pm025",sid:"s60",amount:75,date:"2026-03-09",method:"Zelle",status:"paid",note:""},
{id:"pm026",sid:"s56",amount:75,date:"2026-03-09",method:"Zelle",status:"paid",note:""},
{id:"pm027",sid:"s41",amount:75,date:"2026-03-09",method:"Zelle",status:"paid",note:""},
{id:"pm028",sid:"s52",amount:75,date:"2026-03-09",method:"Zelle",status:"paid",note:""},
{id:"pm029",sid:"s59",amount:75,date:"2026-03-09",method:"Zelle",status:"paid",note:""},
{id:"pm030",sid:"s36",amount:75,date:"2026-03-09",method:"Zelle",status:"paid",note:""},
{id:"pm031",sid:"s4",amount:120,date:"2026-03-09",method:"Zelle",status:"paid",note:""},
{id:"pm032",sid:"s39",amount:75,date:"2026-03-09",method:"Zelle",status:"paid",note:"split from Nalini $150"},
{id:"pm032",sid:"s40",amount:75,date:"2026-03-09",method:"Zelle",status:"paid",note:"split from Nalini $150"},
{id:"pm033",sid:"s67",amount:75,date:"2026-03-09",method:"Zelle",status:"paid",note:""},
{id:"pm034",sid:"s54",amount:75,date:"2026-03-10",method:"Zelle",status:"paid",note:"paid by Jyothi Gali"},
{id:"pm035",sid:"s44",amount:75,date:"2026-03-10",method:"Zelle",status:"paid",note:"split from Naga Deepthi $150"},
{id:"pm036",sid:"s45",amount:75,date:"2026-03-10",method:"Zelle",status:"paid",note:"split from Naga Deepthi $150"},
{id:"pm037",sid:"s1",amount:120,date:"2026-03-10",method:"Zelle",status:"paid",note:""},
{id:"pm038",sid:"s30",amount:75,date:"2026-03-10",method:"Zelle",status:"paid",note:""},
{id:"pm039",sid:"s34",amount:75,date:"2026-03-10",method:"Zelle",status:"paid",note:"paid by Maheshwari Jagadeeshkumar"},
{id:"pm040",sid:"s18",amount:150,date:"2026-03-12",method:"Zelle",status:"paid",note:""},
{id:"pm041",sid:"s66",amount:75,date:"2026-03-12",method:"Zelle",status:"paid",note:""},
{id:"pm042",sid:"s20",amount:150,date:"2026-03-12",method:"Zelle",status:"paid",note:""},
{id:"pm043",sid:"s13",amount:150,date:"2026-03-13",method:"Zelle",status:"paid",note:""},
{id:"pm044",sid:"s2",amount:60,date:"2026-03-13",method:"Zelle",status:"paid",note:""},
{id:"pm045",sid:"s65",amount:75,date:"2026-03-13",method:"Zelle",status:"paid",note:""},
{id:"pm046",sid:"s7",amount:120,date:"2026-03-16",method:"Check",status:"paid",note:""}
];

// ── Design tokens ─────────────────────────────────────────────────────────────
const CARD = { background:C.white, borderRadius:18, padding:20, boxShadow:"0 4px 24px rgba(120,53,15,.1)", border:"1px solid rgba(253,230,138,.4)" };
const BTN_BASE = { fontFamily:"'Lato',sans-serif", fontWeight:700, border:"none", borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6, fontSize:14, padding:"10px 18px", whiteSpace:"nowrap", transition:"transform .15s, box-shadow .15s", outline:"none" };

// ── Primitives ────────────────────────────────────────────────────────────────
const Icon = ({ name, size=18, color="currentColor" }) => {
  const d = {
    home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
    users:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
    dollar:  "M12 1v22 M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6",
    file:    "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    msg:     "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
    plus:    "M12 5v14 M5 12h14",
    edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    trash:   "M3 6h18 M8 6V4h8v2 M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
    check:   "M20 6L9 17l-5-5",
    x:       "M18 6L6 18 M6 6l12 12",
    search:  "M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.35-4.35",
    zap:     "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15",
    mail:    "M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z M22 6l-10 7L2 6",
    phone:   "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.15 10.8 19.79 19.79 0 01.07 2.18 2 2 0 012.04 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 15.92z",
    bell:    "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
    warn:    "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, display:"block" }}>
      {d[name]?.split(" M").map((seg, i) => <path key={i} d={i===0 ? seg : "M"+seg}/>)}
    </svg>
  );
};

const Avatar = ({ name="?", size=42 }) => {
  const grads = [`135deg,${C.a400},${C.b700}`, `135deg,${C.a500},${C.b800}`, `135deg,#fcd34d,${C.a700}`];
  return (
    <div style={{ width:size, height:size, borderRadius:size*.35, background:`linear-gradient(${grads[name.charCodeAt(0)%3]})`, display:"flex", alignItems:"center", justifyContent:"center", color:C.white, fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:size*.42, flexShrink:0 }}>
      {name[0]}
    </div>
  );
};

const Badge = ({ status }) => {
  const styles = {
    paid:    { background:"#d1fae5", color:"#065f46" },
    unpaid:  { background:"#fef3c7", color:"#92400e" },
    overdue: { background:"#fef2f2", color:"#991b1b" },
    pending: { background:"#e0e7ff", color:"#3730a3" },
    active:  { background:"#d1fae5", color:"#065f46" },
    inactive:{ background:"#fef2f2", color:"#991b1b" },
  };
  const s = styles[status] || styles.pending;
  return <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 9px", borderRadius:20, fontSize:11, fontWeight:700, ...s }}>{status}</span>;
};

// Button with explicit type="button" to prevent any form submission edge cases
const Btn = ({ variant="primary", sm=false, onClick, disabled=false, children, style:sx={}, href, type="button" }) => {
  const variants = {
    primary:   { background:`linear-gradient(135deg,${C.a600},${C.b700})`, color:C.white, boxShadow:"0 3px 12px rgba(180,83,9,.28)" },
    secondary: { background:C.a100, color:C.b800, border:`1.5px solid ${C.a200}` },
    ghost:     { background:"transparent", color:C.g500, padding:"8px 12px" },
    danger:    { background:"#fef2f2", color:"#b91c1c", border:"1.5px solid #fecaca" },
  };
  const s = {
    ...BTN_BASE,
    ...variants[variant],
    ...(sm ? { padding:"6px 12px", fontSize:13 } : {}),
    ...(disabled ? { opacity:.55, cursor:"not-allowed", pointerEvents:"none" } : {}),
    ...sx,
  };
  if (href) return <a href={href} style={s}>{children}</a>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={s}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; }}>
      {children}
    </button>
  );
};

const Field = ({ label, children }) => (
  <div>
    {label && <label style={{ fontSize:13, fontWeight:700, color:C.b800, marginBottom:5, display:"block" }}>{label}</label>}
    {children}
  </div>
);

const inputStyle = { fontFamily:"'Lato',sans-serif", background:C.white, border:`1.5px solid ${C.g300}`, borderRadius:10, padding:"10px 14px", fontSize:14, color:C.g700, width:"100%", outline:"none", display:"block" };

// ── Confirm Dialog (replaces window.confirm) ──────────────────────────────────
const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(69,26,3,.6)", backdropFilter:"blur(4px)", zIndex:10000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
    <div style={{ background:C.white, borderRadius:20, padding:28, width:"100%", maxWidth:360, boxShadow:"0 20px 60px rgba(120,53,15,.3)" }}>
      <div style={{ width:48, height:48, borderRadius:16, background:"#fef2f2", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
        <Icon name="trash" size={22} color="#dc2626"/>
      </div>
      <h3 style={{ fontFamily:"'Playfair Display',serif", color:C.b800, marginBottom:8, fontSize:18 }}>Confirm Delete</h3>
      <p style={{ color:C.g500, fontSize:14, marginBottom:22, lineHeight:1.5 }}>{message}</p>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
        <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm}><Icon name="trash" size={14}/>Delete</Btn>
      </div>
    </div>
  </div>
);

// ── Drawer / Modal wrapper ────────────────────────────────────────────────────
const Modal = ({ onClose, children, maxWidth=480 }) => (
  <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(69,26,3,.52)", backdropFilter:"blur(5px)", zIndex:9000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
    <div onClick={e => e.stopPropagation()} style={{ background:C.white, borderRadius:22, padding:26, width:"100%", maxWidth, boxShadow:"0 20px 60px rgba(120,53,15,.25)", maxHeight:"92vh", overflowY:"auto" }}>
      {children}
    </div>
  </div>
);

// ── Student Modal ─────────────────────────────────────────────────────────────
const StudentModal = ({ student, onSave, onClose }) => {
  const [f, setF] = useState(student || { name:"", parentName:"", email:"", phone:"", fee:120, active:true });
  const set = (k, v) => setF(p => ({ ...p, [k]:v }));
  return (
    <Modal onClose={onClose}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", color:C.b800, fontSize:20 }}>{student ? "Edit Student" : "New Student"}</h3>
        <Btn variant="ghost" sm onClick={onClose}><Icon name="x" size={16}/></Btn>
      </div>
      <div style={{ display:"grid", gap:13 }}>
        <Field label="Student Name"><input style={inputStyle} value={f.name} onChange={e=>set("name",e.target.value)} placeholder="Full name"/></Field>
        <Field label="Parent / Guardian Name"><input style={inputStyle} value={f.parentName} onChange={e=>set("parentName",e.target.value)} placeholder="Used for Zelle matching"/></Field>
        <Field label="Email"><input style={inputStyle} type="email" value={f.email} onChange={e=>set("email",e.target.value)} placeholder="parent@email.com"/></Field>
        <Field label="Phone"><input style={inputStyle} type="tel" value={f.phone} onChange={e=>set("phone",e.target.value)} placeholder="555-0100"/></Field>
        <Field label="Monthly Fee ($)"><input style={inputStyle} type="number" value={f.fee} onChange={e=>set("fee",Number(e.target.value))}/></Field>
        <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", fontWeight:700, fontSize:14, color:C.b800 }}>
          <input type="checkbox" checked={f.active} onChange={e=>set("active",e.target.checked)} style={{ width:17, height:17, accentColor:C.a600 }}/> Active Student
        </label>
      </div>
      <div style={{ height:1, background:C.a100, margin:"18px 0" }}/>
      <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => onSave({ ...f, id:student?.id||uid() })}><Icon name="check" size={15}/>Save Student</Btn>
      </div>
    </Modal>
  );
};

// ── Payment Modal ─────────────────────────────────────────────────────────────
const PaymentModal = ({ payment, students, onSave, onClose }) => {
  const [f, setF] = useState(payment || { sid:"", amount:"", date:new Date().toISOString().slice(0,10), method:"Zelle", status:"paid", note:"" });
  const set = (k, v) => setF(p => ({ ...p, [k]:v }));
  return (
    <Modal onClose={onClose}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", color:C.b800, fontSize:20 }}>{payment ? "Edit Payment" : "Record Payment"}</h3>
        <Btn variant="ghost" sm onClick={onClose}><Icon name="x" size={16}/></Btn>
      </div>
      <div style={{ display:"grid", gap:13 }}>
        <Field label="Student">
          <select style={inputStyle} value={f.sid} onChange={e=>{ const st=students.find(x=>x.id===e.target.value); setF(p=>({...p,sid:e.target.value,amount:st?.fee||p.amount})); }}>
            <option value="">Select student…</option>
            {students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Field>
        <Field label="Amount ($)"><input style={inputStyle} type="number" value={f.amount} onChange={e=>set("amount",e.target.value)} placeholder="0.00"/></Field>
        <Field label="Date"><input style={inputStyle} type="date" value={f.date} onChange={e=>set("date",e.target.value)}/></Field>
        <Field label="Method">
          <select style={inputStyle} value={f.method} onChange={e=>set("method",e.target.value)}>
            {["Zelle","Cash","Check","Venmo","Other"].map(m=><option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select style={inputStyle} value={f.status} onChange={e=>set("status",e.target.value)}>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </Field>
        <Field label="Note (optional)"><input style={inputStyle} value={f.note} onChange={e=>set("note",e.target.value)} placeholder="e.g. March tuition"/></Field>
      </div>
      <div style={{ height:1, background:C.a100, margin:"18px 0" }}/>
      <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => onSave({ ...f, id:payment?.id||uid(), amount:Number(f.amount) })}><Icon name="check" size={15}/>Save Payment</Btn>
      </div>
    </Modal>
  );
};

// ── Quick Pay Modal (mobile-optimized) ────────────────────────────────────────
const QuickPayModal = ({ students, payments, onSave, onClose }) => {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(null);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [method, setMethod] = useState("Zelle");
  const [note, setNote] = useState("");
  const inputRef = useRef(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  const cm = thisMonth();
  const active = students.filter(s => s.active);
  const matches = q.length >= 1 ? active.filter(s =>
    s.name.toLowerCase().includes(q.toLowerCase()) ||
    s.parentName.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 6) : [];

  const selectStudent = (s) => { setSel(s); setAmount(s.fee); setQ(""); };

  const handleSave = () => {
    if (!sel || !amount) return;
    onSave({ id:uid(), sid:sel.id, amount:Number(amount), date, method, status:"paid", note });
  };

  // Unpaid students for quick one-tap
  const paidIds = new Set(payments.filter(p=>p.date.startsWith(cm)&&p.status==="paid").map(p=>p.sid));
  const unpaid = active.filter(s => !paidIds.has(s.id));

  return (
    <Modal onClose={onClose}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", color:C.b800, fontSize:20 }}>Quick Pay</h3>
        <Btn variant="ghost" sm onClick={onClose}><Icon name="x" size={16}/></Btn>
      </div>

      {!sel ? (
        <>
          {/* Search by student or parent name */}
          <div style={{ position:"relative", marginBottom:10 }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
              <Icon name="search" size={15} color={C.g500}/>
            </span>
            <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)}
              placeholder="Search student or parent name..."
              style={{ ...inputStyle, paddingLeft:38, fontSize:16 }}
              inputMode="search" autoComplete="off"/>
          </div>

          {/* Search results */}
          {matches.length > 0 && (
            <div style={{ marginBottom:12, maxHeight:200, overflowY:"auto" }}>
              {matches.map(s => {
                const paid = paidIds.has(s.id);
                return (
                  <button type="button" key={s.id} onClick={() => selectStudent(s)}
                    style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", border:"none", borderBottom:`1px solid ${C.a100}`, background:paid?"#f0fdf4":C.white, cursor:"pointer", fontFamily:"'Lato',sans-serif", textAlign:"left" }}>
                    <div>
                      <p style={{ fontWeight:700, fontSize:14, color:C.b800 }}>{s.name}</p>
                      <p style={{ fontSize:12, color:C.g500 }}>{s.parentName}</p>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <p style={{ fontWeight:700, color:C.a700 }}>{fmt$(s.fee)}</p>
                      {paid && <span style={{ fontSize:10, color:"#059669", fontWeight:700 }}>PAID</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Unpaid this month — quick tap list */}
          {q.length === 0 && (
            <div>
              <p style={{ fontSize:12, fontWeight:700, color:C.g500, marginBottom:8, textTransform:"uppercase", letterSpacing:".05em" }}>
                Unpaid this month ({unpaid.length})
              </p>
              <div style={{ maxHeight:300, overflowY:"auto" }}>
                {unpaid.map(s => (
                  <button type="button" key={s.id} onClick={() => selectStudent(s)}
                    style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 12px", border:"none", borderBottom:`1px solid ${C.a100}`, background:C.white, cursor:"pointer", fontFamily:"'Lato',sans-serif", textAlign:"left" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:30, height:30, borderRadius:10, background:`linear-gradient(135deg,${C.a400},${C.b700})`, display:"flex", alignItems:"center", justifyContent:"center", color:C.white, fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:13, flexShrink:0 }}>
                        {s.name[0]}
                      </div>
                      <div>
                        <p style={{ fontWeight:700, fontSize:13, color:C.b800 }}>{s.name}</p>
                        <p style={{ fontSize:11, color:C.g500 }}>{s.parentName}</p>
                      </div>
                    </div>
                    <span style={{ fontWeight:700, color:C.a700, fontSize:14, flexShrink:0 }}>{fmt$(s.fee)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Selected student — fill in details */}
          <div style={{ background:C.a50, borderRadius:12, padding:14, marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <p style={{ fontWeight:700, color:C.b800 }}>{sel.name}</p>
              <p style={{ fontSize:12, color:C.g500 }}>{sel.parentName}</p>
            </div>
            <Btn variant="ghost" sm onClick={() => { setSel(null); setAmount(""); }}><Icon name="x" size={14}/>Change</Btn>
          </div>
          <div style={{ display:"grid", gap:12 }}>
            <Field label="Amount ($)"><input style={{ ...inputStyle, fontSize:18, fontWeight:700 }} type="number" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)}/></Field>
            <Field label="Date"><input style={inputStyle} type="date" value={date} onChange={e=>setDate(e.target.value)}/></Field>
            <Field label="Method">
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {["Zelle","Cash","Check","Venmo"].map(m => (
                  <button type="button" key={m} onClick={() => setMethod(m)}
                    style={{ ...BTN_BASE, padding:"8px 16px", fontSize:14, background:method===m?`linear-gradient(135deg,${C.a600},${C.b700})`:C.a100, color:method===m?C.white:C.b800, border:method===m?"none":`1.5px solid ${C.a200}` }}>
                    {m}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Note (optional)"><input style={inputStyle} value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. March tuition"/></Field>
          </div>
          <div style={{ height:1, background:C.a100, margin:"16px 0" }}/>
          <button type="button" onClick={handleSave} disabled={!sel||!amount}
            style={{ ...BTN_BASE, width:"100%", justifyContent:"center", padding:"14px 18px", fontSize:16, background:`linear-gradient(135deg,${C.a600},${C.b700})`, color:C.white, boxShadow:"0 3px 12px rgba(180,83,9,.28)", opacity:(!sel||!amount)?.5:1 }}>
            <Icon name="check" size={18} color={C.white}/> Save Payment
          </button>
        </>
      )}
    </Modal>
  );
};

// ── Invoice Modal ─────────────────────────────────────────────────────────────
const InvoiceModal = ({ student, payments, onClose }) => {
  const sp = payments.filter(p=>p.sid===student.id).sort((a,b)=>new Date(b.date)-new Date(a.date));
  const total = sp.filter(p=>p.status==="paid").reduce((t,p)=>t+p.amount,0);
  const due = !sp.some(p=>p.date.startsWith(thisMonth())&&p.status==="paid");
  return (
    <Modal onClose={onClose} maxWidth={520}>
      {/* Invoice header */}
      <div style={{ background:`linear-gradient(135deg,${C.b800},${C.a600})`, borderRadius:14, padding:22, color:C.white, marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
          <div>
            <p style={{ fontSize:10, opacity:.65, textTransform:"uppercase", letterSpacing:".12em" }}>Dance Studio · Invoice</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, marginTop:4 }}>{student.name}</h2>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontSize:10, opacity:.65 }}>Issued</p>
            <p style={{ fontWeight:700 }}>{fmtD(new Date())}</p>
          </div>
        </div>
        <div style={{ height:1, background:"rgba(255,255,255,.2)", margin:"12px 0" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
          <div>
            <p style={{ fontSize:11, opacity:.65 }}>Parent / Guardian</p>
            <p style={{ fontWeight:700 }}>{student.parentName}</p>
            {student.email && <p style={{ fontSize:12, opacity:.7 }}>{student.email}</p>}
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontSize:11, opacity:.65 }}>Monthly Rate</p>
            <p style={{ fontSize:26, fontWeight:700 }}>{fmt$(student.fee)}</p>
            {due && <span style={{ background:"#fef3c7", color:"#92400e", fontSize:11, padding:"2px 9px", borderRadius:20, fontWeight:700, display:"inline-block", marginTop:4 }}>DUE NOW</span>}
          </div>
        </div>
      </div>

      <h4 style={{ fontFamily:"'Playfair Display',serif", color:C.b800, marginBottom:12 }}>Payment History</h4>
      <div style={{ maxHeight:230, overflowY:"auto", marginBottom:16 }}>
        {sp.length===0
          ? <p style={{ color:C.g500, textAlign:"center", padding:28, fontSize:13 }}>No payments recorded yet</p>
          : sp.map(p=>(
            <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.a100}` }}>
              <div>
                <p style={{ fontWeight:700, fontSize:14 }}>{fmtD(p.date)}</p>
                <p style={{ fontSize:12, color:C.g500 }}>{p.method}{p.note ? ` · ${p.note}` : ""}</p>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ fontWeight:700, color:C.b700 }}>{fmt$(p.amount)}</p>
                <Badge status={p.status}/>
              </div>
            </div>
          ))
        }
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:12, borderTop:`2px solid ${C.a200}` }}>
        <div>
          <p style={{ fontSize:12, color:C.g500 }}>All-time total paid</p>
          <h3 style={{ fontFamily:"'Playfair Display',serif", color:C.b800, fontSize:22 }}>{fmt$(total)}</h3>
        </div>
        <Btn variant="secondary" onClick={onClose}><Icon name="x" size={15}/>Close</Btn>
      </div>
    </Modal>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, color }) => (
  <div style={{ ...CARD, borderLeft:`4px solid ${color}` }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div>
        <p style={{ fontSize:11, color:C.g500, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em" }}>{label}</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginTop:3, color:C.b800 }}>{value}</h2>
        {sub && <p style={{ fontSize:11, color:C.g500, marginTop:2 }}>{sub}</p>}
      </div>
      <div style={{ width:42, height:42, borderRadius:13, background:color+"22", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon name={icon} color={color} size={20}/>
      </div>
    </div>
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = ({ students, payments, setPage, addPayment, addStudent }) => {
  const active = students.filter(s=>s.active);
  const cm = thisMonth();
  const cmP = payments.filter(p=>p.date.startsWith(cm)&&p.status==="paid");
  const revenue = cmP.reduce((t,p)=>t+p.amount,0);
  const paidIds = new Set(cmP.map(p=>p.sid));
  const unpaid = active.filter(s=>!paidIds.has(s.id));
  const expected = active.reduce((t,s)=>t+s.fee,0);
  const pct = expected > 0 ? Math.min(Math.round(revenue/expected*100), 100) : 0;
  const recent = [...payments].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);

  return (
    <div>
      <h1 style={{ fontFamily:"'Playfair Display',serif", color:C.b900, fontSize:28, marginBottom:4 }}>Good day! 🌟</h1>
      <p style={{ color:C.g500, marginBottom:22, fontSize:14 }}>{new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"})}</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        <StatCard label="Students" value={active.length} sub={`${students.filter(s=>!s.active).length} inactive`} icon="users" color={C.a600}/>
        <StatCard label="Revenue" value={fmt$(revenue)} sub={`${pct}% of ${fmt$(expected)}`} icon="dollar" color={C.b700}/>
        <StatCard label="Paid" value={paidIds.size} sub="this month" icon="check" color="#059669"/>
        <StatCard label="Pending" value={unpaid.length} sub="need payment" icon="bell" color="#dc2626"/>
      </div>

      {/* Progress bar */}
      <div style={{ ...CARD, marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:13, fontWeight:700, color:C.b800 }}>Monthly Collection</span>
          <span style={{ fontSize:13, fontWeight:700, color:C.a700 }}>{pct}%</span>
        </div>
        <div style={{ height:10, background:C.a100, borderRadius:10, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${C.a400},${C.b700})`, borderRadius:10, transition:"width .6s ease" }}/>
        </div>
        <p style={{ fontSize:12, color:C.g500, marginTop:5 }}>{fmt$(revenue)} of {fmt$(expected)} expected</p>
      </div>

      {/* Quick actions */}
      <div style={{ ...CARD, marginBottom:14 }}>
        <p style={{ fontSize:13, fontWeight:700, color:C.b800, marginBottom:12 }}>Quick Actions</p>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <Btn sm onClick={addPayment}><Icon name="plus" size={13}/>Record Payment</Btn>
          <Btn variant="secondary" sm onClick={addStudent}><Icon name="plus" size={13}/>Add Student</Btn>
          <Btn variant="secondary" sm onClick={()=>setPage("messages")}><Icon name="zap" size={13}/>Scan Zelle</Btn>
        </div>
      </div>

      {/* Unpaid this month */}
      {unpaid.length > 0 && (
        <div style={{ ...CARD, borderLeft:`4px solid ${C.a500}`, marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Icon name="warn" color={C.a600} size={16}/>
              <p style={{ fontWeight:700, color:C.b800, fontSize:14 }}>Unpaid This Month ({unpaid.length})</p>
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:C.a700 }}>
              {fmt$(unpaid.reduce((t,s)=>t+s.fee,0))} outstanding
            </span>
          </div>
          <div style={{ maxHeight:300, overflowY:"auto", marginRight:-4, paddingRight:4 }}>
            {unpaid.map((s, i) => (
              <div key={s.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${C.a100}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:30, height:30, borderRadius:10, background:`linear-gradient(135deg,${C.a400},${C.b700})`, display:"flex", alignItems:"center", justifyContent:"center", color:C.white, fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:13, flexShrink:0 }}>
                    {s.name[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight:700, fontSize:13 }}>{s.name}</p>
                    <p style={{ fontSize:11, color:C.g500 }}>{s.parentName}</p>
                  </div>
                </div>
                <span style={{ fontWeight:700, color:C.a700, fontSize:14, flexShrink:0 }}>{fmt$(s.fee)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent payments */}
      <div style={{ ...CARD }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <p style={{ fontWeight:700, color:C.b800 }}>Recent Payments</p>
          <Btn variant="ghost" sm onClick={()=>setPage("payments")}>View all →</Btn>
        </div>
        {recent.length === 0
          ? <p style={{ color:C.g500, textAlign:"center", padding:20, fontSize:13 }}>No payments yet</p>
          : recent.map(p => {
              const s = students.find(x=>x.id===p.sid);
              return (
                <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${C.a100}` }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <Avatar name={s?.name||"?"} size={36}/>
                    <div>
                      <p style={{ fontWeight:700, fontSize:13 }}>{s?.name||"Unknown"}</p>
                      <p style={{ fontSize:11, color:C.g500 }}>{fmtD(p.date)} · {p.method}</p>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontWeight:700, color:C.b700 }}>{fmt$(p.amount)}</p>
                    <Badge status={p.status}/>
                  </div>
                </div>
              );
            })
        }
      </div>
    </div>
  );
};

// ── Students Page ─────────────────────────────────────────────────────────────
const StudentsPage = ({ students, payments, onAdd, onEdit, onDelete, onInvoice }) => {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const list = students.filter(s => {
    const match = s.name.toLowerCase().includes(q.toLowerCase()) || s.parentName.toLowerCase().includes(q.toLowerCase());
    const filt = filter==="all" || (filter==="active"&&s.active) || (filter==="inactive"&&!s.active);
    return match && filt;
  });
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", color:C.b900, fontSize:24 }}>Students</h1>
        <Btn sm onClick={onAdd}><Icon name="plus" size={14}/>Add Student</Btn>
      </div>

      {/* Search */}
      <div style={{ position:"relative", marginBottom:10 }}>
        <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
          <Icon name="search" size={15} color={C.g500}/>
        </span>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search students or parents…"
          style={{ ...inputStyle, paddingLeft:38 }}/>
      </div>

      {/* Filter pills */}
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {["all","active","inactive"].map(f => (
          <Btn key={f} variant={filter===f?"primary":"secondary"} sm onClick={()=>setFilter(f)} style={{ textTransform:"capitalize" }}>{f}</Btn>
        ))}
      </div>

      <div style={{ display:"grid", gap:12 }}>
        {list.map(s => {
          const paid = payments.some(p=>p.sid===s.id&&p.date.startsWith(thisMonth())&&p.status==="paid");
          return (
            <div key={s.id} style={{ ...CARD }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:12 }}>
                <Avatar name={s.name} size={48}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:C.b800 }}>{s.name}</h3>
                    <p style={{ fontWeight:700, color:C.a700, fontSize:16, flexShrink:0 }}>{fmt$(s.fee)}<span style={{ fontSize:11, color:C.g500 }}>/mo</span></p>
                  </div>
                  <p style={{ fontSize:13, color:C.g500, marginTop:1 }}>{s.parentName}</p>
                  {s.email && <p style={{ fontSize:12, color:C.g500 }}>{s.email}</p>}
                  <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
                    <Badge status={s.active?"active":"inactive"}/>
                    <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 9px", borderRadius:20, fontSize:11, fontWeight:700, background:paid?"#d1fae5":"#fef3c7", color:paid?"#065f46":"#92400e" }}>
                      {paid ? "Paid ✓" : "Unpaid"}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ height:1, background:C.a100, marginBottom:12 }}/>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {s.email && <Btn variant="ghost" sm href={`mailto:${s.email}`}><Icon name="mail" size={13}/>Email</Btn>}
                {s.phone && <Btn variant="ghost" sm href={`tel:${s.phone}`}><Icon name="phone" size={13}/>Call</Btn>}
                <Btn variant="secondary" sm onClick={()=>onInvoice(s)}><Icon name="file" size={13}/>Invoice</Btn>
                <Btn variant="ghost" sm onClick={()=>onEdit(s)}><Icon name="edit" size={13}/>Edit</Btn>
                <Btn variant="danger" sm onClick={()=>onDelete(s.id)}><Icon name="trash" size={13}/>Delete</Btn>
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <div style={{ textAlign:"center", padding:48, color:C.g500 }}>
            <p style={{ fontSize:36, marginBottom:8 }}>🔍</p>
            <p>No students found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Payments Page ─────────────────────────────────────────────────────────────
const PaymentsPage = ({ payments, students, onAdd, onEdit, onDelete }) => {
  const [month, setMonth] = useState(thisMonth());
  const [method, setMethod] = useState("all");
  const methods = [...new Set(payments.map(p=>p.method))];
  const filtered = payments
    .filter(p => (!month||p.date.startsWith(month)) && (method==="all"||p.method===method))
    .sort((a,b)=>new Date(b.date)-new Date(a.date));
  const total = filtered.filter(p=>p.status==="paid").reduce((t,p)=>t+p.amount,0);

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", color:C.b900, fontSize:24 }}>Payments</h1>
        <Btn sm onClick={onAdd}><Icon name="plus" size={14}/>Record</Btn>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap", alignItems:"center" }}>
        <input type="month" value={month} onChange={e=>setMonth(e.target.value)}
          style={{ ...inputStyle, maxWidth:185 }}/>
        <Btn variant="ghost" sm onClick={()=>setMonth("")}>All time</Btn>
      </div>

      {methods.length > 0 && (
        <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
          {["all",...methods].map(m => (
            <Btn key={m} variant={method===m?"primary":"secondary"} sm onClick={()=>setMethod(m)} style={{ textTransform:"capitalize" }}>{m}</Btn>
          ))}
        </div>
      )}

      {/* Summary card */}
      <div style={{ ...CARD, marginBottom:14, background:`linear-gradient(135deg,${C.b800},${C.a600})`, color:C.white, padding:"18px 22px" }}>
        <p style={{ fontSize:11, opacity:.65, textTransform:"uppercase", letterSpacing:".08em" }}>Total Collected</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, marginTop:3 }}>{fmt$(total)}</h2>
        <p style={{ fontSize:12, opacity:.65, marginTop:3 }}>{filtered.filter(p=>p.status==="paid").length} payments · {month||"all time"}</p>
      </div>

      <div style={{ display:"grid", gap:10 }}>
        {filtered.map(p => {
          const s = students.find(x=>x.id===p.sid);
          return (
            <div key={p.id} style={{ ...CARD, padding:"13px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
                <div style={{ display:"flex", gap:10, alignItems:"center", minWidth:0, flex:1 }}>
                  <Avatar name={s?.name||"?"} size={38}/>
                  <div style={{ minWidth:0 }}>
                    <p style={{ fontWeight:700, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s?.name||"Unknown"}</p>
                    <p style={{ fontSize:12, color:C.g500 }}>{fmtD(p.date)} · {p.method}</p>
                    {p.note && <p style={{ fontSize:11, color:C.g500, fontStyle:"italic" }}>{p.note}</p>}
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontWeight:700, color:C.b700, fontSize:15 }}>{fmt$(p.amount)}</p>
                    <Badge status={p.status}/>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                    <Btn variant="ghost" sm onClick={()=>onEdit(p)} style={{ padding:"5px 8px" }}><Icon name="edit" size={13}/></Btn>
                    <Btn variant="danger" sm onClick={()=>onDelete(p.id)} style={{ padding:"5px 8px" }}><Icon name="trash" size={13}/></Btn>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:48, color:C.g500 }}>
            <p style={{ fontSize:36, marginBottom:8 }}>💸</p>
            <p>No payments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Invoices Page ─────────────────────────────────────────────────────────────
const InvoicesPage = ({ students, payments, onInvoice }) => {
  const active = students.filter(s=>s.active);
  return (
    <div>
      <h1 style={{ fontFamily:"'Playfair Display',serif", color:C.b900, fontSize:24, marginBottom:6 }}>Invoices</h1>
      <p style={{ color:C.g500, fontSize:13, marginBottom:18 }}>Tap any student to view their full invoice</p>
      <div style={{ display:"grid", gap:12 }}>
        {active.map(s => {
          const paid = payments.some(p=>p.sid===s.id&&p.date.startsWith(thisMonth())&&p.status==="paid");
          const allPaid = payments.filter(p=>p.sid===s.id&&p.status==="paid");
          const totalPaid = allPaid.reduce((t,p)=>t+p.amount,0);
          const last = allPaid.sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
          return (
            <button key={s.id} type="button" onClick={()=>onInvoice(s)} style={{ ...CARD, cursor:"pointer", textAlign:"left", width:"100%", display:"block", transition:"transform .18s, box-shadow .18s" }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(120,53,15,.18)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <Avatar name={s.name} size={46}/>
                  <div>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:C.b800 }}>{s.name}</h3>
                    <p style={{ fontSize:12, color:C.g500 }}>{s.parentName}</p>
                    <p style={{ fontSize:11, color:C.g500, marginTop:2 }}>
                      {allPaid.length} payments · {fmt$(totalPaid)} total
                      {last ? ` · last ${fmtD(last.date)}` : ""}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <p style={{ fontWeight:700, color:C.a700 }}>{fmt$(s.fee)}<span style={{ fontSize:11, color:C.g500 }}>/mo</span></p>
                  <span style={{ display:"inline-block", marginTop:4, fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:20, background:paid?"#d1fae5":"#fef3c7", color:paid?"#065f46":"#92400e" }}>
                    {paid?"Paid":"Due"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
        {active.length === 0 && <p style={{ textAlign:"center", color:C.g500, padding:40 }}>No active students</p>}
      </div>
    </div>
  );
};

// ── Zelle Page ────────────────────────────────────────────────────────────────
const ZellePage = ({ students, payments }) => {
  const [status, setStatus] = useState("idle");
  const [matched, setMatched] = useState([]);

  const doScan = async () => {
    setStatus("scanning");
    setMatched([]);
    await new Promise(r => setTimeout(r, 900));
    setStatus("tip");
  };

  return (
    <div>
      <h1 style={{ fontFamily:"'Playfair Display',serif", color:C.b900, fontSize:24, marginBottom:6 }}>Zelle Scanner</h1>
      <p style={{ color:C.g500, fontSize:13, marginBottom:20 }}>Auto-detect Zelle payments from your iMessages</p>

      <div style={{ ...CARD, marginBottom:16, background:C.a50, border:`1.5px solid ${C.a200}` }}>
        <div style={{ display:"flex", gap:14 }}>
          <div style={{ width:44, height:44, borderRadius:14, background:C.a500, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Icon name="zap" size={22} color={C.white}/>
          </div>
          <div>
            <p style={{ fontWeight:700, color:C.b800, marginBottom:5 }}>How It Works</p>
            <p style={{ fontSize:13, color:C.g500, lineHeight:1.6 }}>
              Reads unread iMessages for Zelle payment notifications. If a sender's name matches a parent on your roster, that student is automatically marked as paid for this month.
            </p>
          </div>
        </div>
      </div>

      <button type="button" onClick={doScan} disabled={status==="scanning"}
        style={{ ...BTN_BASE, background:`linear-gradient(135deg,${C.a600},${C.b700})`, color:C.white, boxShadow:"0 3px 12px rgba(180,83,9,.28)", width:"100%", justifyContent:"center", padding:"14px 18px", fontSize:15, marginBottom:16, opacity:status==="scanning"?.7:1 }}>
        {status==="scanning" ? (
          <><span style={{ display:"inline-block", width:16, height:16, border:`2px solid rgba(255,255,255,.3)`, borderTopColor:C.white, borderRadius:"50%", animation:"_da_spin 1s linear infinite" }}/>Scanning Messages…</>
        ) : (
          <><Icon name="refresh" size={16} color={C.white}/>Scan iMessages for Zelle Payments</>
        )}
      </button>

      {status==="tip" && (
        <div style={{ background:"#fef3c7", border:`1.5px solid ${C.a200}`, borderRadius:12, padding:16, marginBottom:16, display:"flex", gap:12 }}>
          <Icon name="warn" color={C.a700} size={18}/>
          <div>
            <p style={{ fontWeight:700, color:C.b800, marginBottom:5 }}>Use Claude Chat to Scan Real Messages</p>
            <p style={{ fontSize:13, color:C.b800, lineHeight:1.6 }}>
              Type in the chat: <strong>"Scan my iMessages for Zelle payments"</strong> — Claude will read your messages and automatically mark matching students as paid here.
            </p>
          </div>
        </div>
      )}

      {matched.length > 0 && (
        <div style={{ marginBottom:20 }}>
          <p style={{ fontWeight:700, color:C.b800, marginBottom:10 }}>✅ {matched.length} Match{matched.length>1?"es":""} Found</p>
          {matched.map((m,i) => (
            <div key={i} style={{ ...CARD, marginBottom:10, borderLeft:"4px solid #10b981" }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div>
                  <p style={{ fontWeight:700, color:C.b800 }}>{m.studentName}</p>
                  <p style={{ fontSize:12, color:C.g500 }}>From: {m.senderName}</p>
                </div>
                <span style={{ fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:20, background:m.alreadyPaid?"#e0e7ff":"#d1fae5", color:m.alreadyPaid?"#3730a3":"#065f46" }}>
                  {m.alreadyPaid?"Already Paid":"✓ Marked Paid"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Parent roster */}
      <div>
        <p style={{ fontWeight:700, color:C.b800, marginBottom:8, fontSize:15 }}>Parent Roster</p>
        <p style={{ fontSize:12, color:C.g500, marginBottom:12 }}>The scanner matches these names against message senders:</p>
        <div style={{ display:"grid", gap:8 }}>
          {students.filter(s=>s.active).map(s => {
            const paid = payments.some(p=>p.sid===s.id&&p.date.startsWith(thisMonth())&&p.status==="paid");
            return (
              <div key={s.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 14px", background:C.a50, borderRadius:12, border:`1px solid ${C.a100}` }}>
                <div>
                  <p style={{ fontWeight:700, fontSize:13, color:C.b800 }}>{s.parentName}</p>
                  <p style={{ fontSize:11, color:C.g500 }}>→ {s.name}</p>
                </div>
                <span style={{ fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:20, background:paid?"#d1fae5":"#fef3c7", color:paid?"#065f46":"#92400e" }}>
                  {paid?"Paid":"Unpaid"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Nav ───────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"dashboard", label:"Dashboard", icon:"home" },
  { id:"students",  label:"Students",  icon:"users" },
  { id:"payments",  label:"Payments",  icon:"dollar" },
  { id:"invoices",  label:"Invoices",  icon:"file" },
  { id:"messages",  label:"Zelle",     icon:"msg" },
];

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [students, setStudents] = useState(STUDENTS0);
  const [payments, setPayments] = useState(PAYMENTS0);
  const [ready, setReady] = useState(false);
  const [wide, setWide] = useState(() => typeof window !== "undefined" ? window.innerWidth >= 768 : true);

  // Modal state
  const [stuModal, setStuModal] = useState(null);   // null | "add" | student obj
  const [payModal, setPayModal] = useState(null);   // null | "add" | payment obj
  const [invModal, setInvModal] = useState(null);   // null | student obj
  const [confirm, setConfirm] = useState(null);     // null | { message, onConfirm }

  // Responsive
  useEffect(() => {
    const h = () => setWide(window.innerWidth >= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const [quickPay, setQuickPay] = useState(false);
  const [syncStatus, setSyncStatus] = useState("loading"); // loading | synced | offline

  // ── Firestore: migrate seed data + real-time sync ──
  useEffect(() => {
    const fireDb = window.db;
    if (!fireDb) { setReady(true); setSyncStatus("offline"); return; }

    let unsubStudents = null, unsubPayments = null;

    // Migration: if Firestore is empty, seed it with STUDENTS0 + PAYMENTS0
    fireDb.collection('students').limit(1).get().then(snap => {
      if (snap.empty) {
        setSyncStatus("loading");
        // Fix duplicate IDs in PAYMENTS0 (pm032 appears twice)
        const seen = new Set();
        const fixedPayments = PAYMENTS0.map(p => {
          if (seen.has(p.id)) return { ...p, id: p.id + "_" + uid() };
          seen.add(p.id);
          return p;
        });
        const batch = fireDb.batch();
        STUDENTS0.forEach(s => batch.set(fireDb.collection('students').doc(s.id), s));
        fixedPayments.forEach(p => batch.set(fireDb.collection('payments').doc(p.id), p));
        return batch.commit();
      }
    }).then(() => {
      // Real-time listeners — data auto-syncs across all devices
      unsubStudents = fireDb.collection('students').onSnapshot(snap => {
        const data = snap.docs.map(d => d.data());
        if (data.length > 0) setStudents(data);
        setReady(true);
        setSyncStatus("synced");
      }, err => { console.error("Students listener error", err); setSyncStatus("offline"); setReady(true); });

      unsubPayments = fireDb.collection('payments').onSnapshot(snap => {
        const data = snap.docs.map(d => d.data());
        setPayments(data);
      }, err => { console.error("Payments listener error", err); });
    }).catch(err => {
      console.error("Firestore init error", err);
      setSyncStatus("offline");
      setReady(true);
    });

    return () => { if (unsubStudents) unsubStudents(); if (unsubPayments) unsubPayments(); };
  }, []);

  // CRUD — optimistic local update + Firestore write (onSnapshot confirms)
  const saveStu = s => {
    setStudents(p => p.find(x=>x.id===s.id) ? p.map(x=>x.id===s.id?s:x) : [...p,s]);
    setStuModal(null);
    fsSet('students', s.id, s);
  };
  const deleteStu = id => setConfirm({
    message:"This will permanently remove the student and all associated data.",
    onConfirm:() => { setStudents(p=>p.filter(s=>s.id!==id)); setConfirm(null); fsDel('students', id); }
  });
  const savePay = p => {
    setPayments(prev => prev.find(x=>x.id===p.id) ? prev.map(x=>x.id===p.id?p:x) : [...prev,p]);
    setPayModal(null);
    setQuickPay(false);
    fsSet('payments', p.id, p);
  };
  const deletePay = id => setConfirm({
    message:"This will permanently delete this payment record.",
    onConfirm:() => { setPayments(p=>p.filter(x=>x.id!==id)); setConfirm(null); fsDel('payments', id); }
  });

  // Zelle auto-match (called by conversation layer)
  const applyZelleMatches = useCallback((senderNames) => {
    const cm = thisMonth(), newPmts = [], result = [];
    for (const name of senderNames) {
      const s = students.find(st => st.active && st.parentName.toLowerCase().split(" ").some(part => name.toLowerCase().includes(part) && part.length > 2));
      if (s) {
        const already = payments.some(p => p.sid===s.id && p.date.startsWith(cm) && p.status==="paid");
        if (!already) newPmts.push({ id:uid(), sid:s.id, amount:s.fee, date:new Date().toISOString().slice(0,10), method:"Zelle", status:"paid", note:"Auto-detected from iMessage" });
        result.push({ studentName:s.name, senderName:name, alreadyPaid:already });
      }
    }
    if (newPmts.length) setPayments(p => [...p, ...newPmts]);
    return result;
  }, [students, payments]);

  useEffect(() => { window.danceApp = { applyZelleMatches }; }, [applyZelleMatches]);

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard students={students} payments={payments} setPage={setPage} addPayment={()=>setPayModal("add")} addStudent={()=>setStuModal("add")}/>;
      case "students":  return <StudentsPage students={students} payments={payments} onAdd={()=>setStuModal("add")} onEdit={s=>setStuModal(s)} onDelete={deleteStu} onInvoice={s=>setInvModal(s)}/>;
      case "payments":  return <PaymentsPage payments={payments} students={students} onAdd={()=>setPayModal("add")} onEdit={p=>setPayModal(p)} onDelete={deletePay}/>;
      case "invoices":  return <InvoicesPage students={students} payments={payments} onInvoice={s=>setInvModal(s)}/>;
      case "messages":  return <ZellePage students={students} payments={payments}/>;
    }
  };

  if (!ready) return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, background:C.cream, fontFamily:"'Lato',sans-serif" }}>
      <div style={{ width:54, height:54, borderRadius:18, background:`linear-gradient(135deg,${C.a500},${C.b800})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon name="home" size={26} color={C.white}/>
      </div>
      <h2 style={{ fontFamily:"'Playfair Display',serif", color:C.b800 }}>DanceApp</h2>
      <p style={{ color:C.g500, fontSize:14 }}>Loading your data…</p>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.cream}; font-family: 'Lato', sans-serif; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.a100}; }
        ::-webkit-scrollbar-thumb { background: ${C.a400}; border-radius: 3px; }
        @keyframes _da_spin { to { transform: rotate(360deg); } }
        a { text-decoration: none; }
        button { font-family: 'Lato', sans-serif; }
      `}</style>

      <div style={{ display:"flex", minHeight:"100vh", background:C.cream }}>

        {/* ── Desktop Sidebar ── */}
        {wide && (
          <aside style={{ width:240, background:C.white, borderRight:`1px solid ${C.a100}`, position:"fixed", top:0, left:0, bottom:0, display:"flex", flexDirection:"column", zIndex:100, boxShadow:"2px 0 16px rgba(120,53,15,.07)" }}>
            <div style={{ padding:"26px 20px 20px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:14, background:`linear-gradient(135deg,${C.a500},${C.b800})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="home" size={20} color={C.white}/>
                </div>
                <div>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:C.b900, lineHeight:1 }}>DanceApp</h2>
                  <p style={{ fontSize:11, color:C.g500, marginTop:2 }}>Fee Manager</p>
                </div>
              </div>
            </div>
            <div style={{ height:1, background:C.a100, margin:"0 16px" }}/>
            <nav style={{ padding:"12px 10px", flex:1 }}>
              {NAV.map(item => {
                const active = page === item.id;
                return (
                  <button type="button" key={item.id} onClick={() => setPage(item.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"11px 14px", borderRadius:12, border:"none", cursor:"pointer", background:active?`linear-gradient(135deg,${C.a600},${C.b700})`:"transparent", color:active?C.white:C.g500, fontFamily:"'Lato',sans-serif", fontWeight:700, fontSize:14, marginBottom:4, transition:"background .18s, color .18s", textAlign:"left" }}>
                    <Icon name={item.icon} size={17} color={active?C.white:C.g500}/>{item.label}
                  </button>
                );
              })}
            </nav>
            <div style={{ padding:"14px 20px", borderTop:`1px solid ${C.a100}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:8, height:8, borderRadius:4, background:syncStatus==="synced"?"#10b981":syncStatus==="loading"?"#f59e0b":"#ef4444" }}/>
                <p style={{ fontSize:11, color:C.g500, fontWeight:700 }}>
                  {syncStatus==="synced"?"Cloud synced":syncStatus==="loading"?"Syncing...":"Offline mode"}
                </p>
              </div>
            </div>
          </aside>
        )}

        {/* ── Content Area ── */}
        <div style={{ flex:1, marginLeft:wide?240:0, display:"flex", flexDirection:"column" }}>
          {/* Mobile header */}
          {!wide && (
            <header style={{ position:"sticky", top:0, zIndex:50, background:"rgba(253,248,240,.96)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${C.a100}`, padding:"13px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:10, background:`linear-gradient(135deg,${C.a500},${C.b800})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="home" size={16} color={C.white}/>
                </div>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:C.b900 }}>DanceApp</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:4, padding:"5px 10px", borderRadius:8, background:syncStatus==="synced"?"#ecfdf5":syncStatus==="loading"?"#fffbeb":"#fef2f2" }}>
                  <div style={{ width:6, height:6, borderRadius:3, background:syncStatus==="synced"?"#10b981":syncStatus==="loading"?"#f59e0b":"#ef4444" }}/>
                  <span style={{ fontSize:10, fontWeight:700, color:syncStatus==="synced"?"#059669":syncStatus==="loading"?"#d97706":"#dc2626" }}>
                    {syncStatus==="synced"?"Synced":syncStatus==="loading"?"Syncing...":"Offline"}
                  </span>
                </div>
              </div>
            </header>
          )}

          {/* Page content */}
          <main style={{ padding:wide?"30px 36px":"18px 16px", paddingBottom:wide?40:96, flex:1 }}>
            {renderPage()}
          </main>
        </div>

        {/* ── Mobile bottom nav ── */}
        {!wide && (
          <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:C.white, borderTop:`1px solid ${C.a100}`, boxShadow:"0 -4px 20px rgba(120,53,15,.09)", display:"flex", zIndex:100 }}>
            {NAV.map(item => {
              const active = page === item.id;
              return (
                <button type="button" key={item.id} onClick={() => setPage(item.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"9px 4px 8px", border:"none", cursor:"pointer", background:"transparent", color:active?C.a600:C.g500, transition:"color .18s", fontFamily:"'Lato',sans-serif" }}>
                  <div style={{ width:32, height:32, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", background:active?`linear-gradient(135deg,${C.a500},${C.b700})`:"transparent", transition:"background .18s", marginBottom:2 }}>
                    <Icon name={item.icon} size={17} color={active?C.white:C.g500}/>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700 }}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* ── Quick Pay FAB (mobile) ── */}
        {!wide && (
          <button type="button" onClick={() => setQuickPay(true)}
            style={{ position:"fixed", bottom:78, right:18, width:56, height:56, borderRadius:28, background:`linear-gradient(135deg,${C.a500},${C.b700})`, color:C.white, border:"none", boxShadow:"0 4px 20px rgba(180,83,9,.4)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", zIndex:90, transition:"transform .15s" }}
            onTouchStart={e => e.currentTarget.style.transform="scale(0.92)"}
            onTouchEnd={e => e.currentTarget.style.transform=""}>
            <Icon name="dollar" size={24} color={C.white}/>
          </button>
        )}

        {/* ── Quick Pay Modal ── */}
        {quickPay && (
          <QuickPayModal
            students={students}
            payments={payments}
            onSave={savePay}
            onClose={() => setQuickPay(false)}
          />
        )}

        {/* ── Modals ── */}
        {stuModal && (
          <StudentModal
            student={typeof stuModal==="object" ? stuModal : null}
            onSave={saveStu}
            onClose={() => setStuModal(null)}
          />
        )}
        {payModal && (
          <PaymentModal
            payment={typeof payModal==="object" ? payModal : null}
            students={students}
            onSave={savePay}
            onClose={() => setPayModal(null)}
          />
        )}
        {invModal && (
          <InvoiceModal
            student={invModal}
            payments={payments}
            onClose={() => setInvModal(null)}
          />
        )}

        {/* ── Confirm Dialog (replaces window.confirm) ── */}
        {confirm && (
          <ConfirmDialog
            message={confirm.message}
            onConfirm={confirm.onConfirm}
            onCancel={() => setConfirm(null)}
          />
        )}

        {/* Cloud-synced — no export/import needed */}
      </div>
    </>
  );
}
