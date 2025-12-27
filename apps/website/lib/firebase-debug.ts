// This file helps verify Firebase connection
// Run this in browser console to test: 
// import { db } from '@/lib/firebase'; import { collection, getDocs } from 'firebase/firestore'; getDocs(collection(db, 'experiences')).then(snap => console.log('Experiences:', snap.docs.map(d => ({ id: d.id, ...d.data() }))));







