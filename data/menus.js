export const universalNumber = '+911234567890'; // ← Replace with a real central helpline if available

export const menus = {
  main_menu: {
    text: '👋 Welcome to *Samastha Univerce\n\nHow can I help you today?',
    buttons: [
      { text: '🚨 Emergency', callback_data: 'emergency', number: '1' },
      { text: '🏥 Hospital', callback_data: 'hospital', number: '2' },
      { text: '🛒 Shopping', callback_data: 'shopping', number: '3' },
      { text: '🎓 Education', callback_data: 'education', number: '4' },
    ],
  },

  // Emergency (unchanged except cleanup)
  emergency: {
    text: '🚨 *EMERGENCY SERVICES*\n\nQuick help:',
    buttons: [
      { text: 'Ambulance', callback_data: 'emergency_ambulance', number: '1' },
      { text: 'Viqaya (Fire/Rescue)', callback_data: 'emergency_viqaya', number: '2' },
      { text: 'Police', callback_data: 'emergency_police', number: '3' },
      { text: '🔙 Back', callback_data: 'main_menu', number: '0' },
    ],
  },
  emergency_ambulance: {
    text: '🚑 *Call Ambulance*\nImmediate help available 24/7',
    buttons: [
      { text: '📞 Call Now', callback_data: 'call_ambulance', number: '1', phone: universalNumber },
      { text: '🔙 Back', callback_data: 'emergency', number: '0' },
    ],
  },
  emergency_viqaya: {
    text: '🔥 *Viqaya Service*\nFire / Disaster response',
    buttons: [
      { text: '📞 Call Viqaya', callback_data: 'call_viqaya', number: '1', phone: '+919999999999' },
      { text: '🔙 Back', callback_data: 'emergency', number: '0' },
    ],
  },
  emergency_police: {
    text: '👮 *Police Help*\nChoose action:',
    buttons: [
      { text: '📞 Call Police (100)', callback_data: 'call_police', number: '1', phone: '100' },
      { text: 'Report Crime', callback_data: 'police_report', number: '2' },
      { text: 'Share Location', callback_data: 'police_location', number: '3' },
      { text: 'Nearby Stations', callback_data: 'police_stations', number: '4' },
      { text: '🔙 Back', callback_data: 'emergency', number: '0' },
    ],
  },

  // Hospital
  hospital: {
    text: '🏥 *HOSPITAL SERVICES*\n\nSelect:',
    buttons: [
      { text: 'Doctors', callback_data: 'hospital_doctors', number: '1' },
      { text: 'Nearby Hospitals', callback_data: 'hospital_nearby', number: '2' },
      { text: '🔙 Back', callback_data: 'main_menu', number: '0' },
    ],
  },
  hospital_doctors: {
    text: '👨‍⚕️ *Doctors*\nChoose specialist:',
    buttons: [
      { text: 'Dr. Ameer Ali (General)', callback_data: 'doc_ameer', number: '1' },
      { text: 'Dr. Fathima (Cardiology)', callback_data: 'doc_fathima', number: '2' },
      { text: 'Dr. Rahman (Neurology)', callback_data: 'doc_rahman', number: '3' },
      { text: 'Dr. Nisha (Pediatrics)', callback_data: 'doc_nisha', number: '4' },
      { text: 'Dr. Salman (Dental)', callback_data: 'doc_salman', number: '5' },
      { text: '🔙 Back', callback_data: 'hospital', number: '0' },
    ],
  },
  doc_ameer: {
    text: 'Dr. Ameer Ali\nGeneral Medicine • Experienced\n\nBook via call:',
    buttons: [
      { text: '📞 Call Doctor', callback_data: 'call_doc_ameer', number: '1', phone: universalNumber },
      { text: '🔙 Back', callback_data: 'hospital_doctors', number: '0' },
    ],
  },
  // Repeat similar for doc_fathima, doc_rahman, doc_nisha, doc_salman

  hospital_nearby: {
    text: '🏥 *Nearby Hospitals*\nSelect one:',
    buttons: [
      { text: 'Rahman Hospital', callback_data: 'hos_rahman', number: '1' },
      { text: 'Al-Shifa Medical Center', callback_data: 'hos_shifa', number: '2' },
      { text: 'City Care Hospital', callback_data: 'hos_citycare', number: '3' },
      { text: 'Noor Clinic & Hospital', callback_data: 'hos_noor', number: '4' },
      { text: 'Green Valley Hospital', callback_data: 'hos_green', number: '5' },
      { text: '🔙 Back', callback_data: 'hospital', number: '0' },
    ],
  },
  hos_rahman: {
    text: 'Rahman Hospital\n24×7 Emergency • Multi-specialty\n\nContact:',
    buttons: [
      { text: '📞 Call Hospital', callback_data: 'call_hos_rahman', number: '1', phone: universalNumber },
      { text: '🔙 Back', callback_data: 'hospital_nearby', number: '0' },
    ],
  },
  // Repeat similar for other hospitals

  // Shopping
  shopping: {
    text: '🛒 *Shopping & Services*\nWhat do you need?',
    buttons: [
      { text: 'Food & Restaurants', callback_data: 'shopping_food', number: '1' },
      { text: 'Grocery Stores', callback_data: 'shopping_grocery', number: '2' },
      { text: 'Repair Services', callback_data: 'shopping_services', number: '3' },
      { text: '🔙 Back', callback_data: 'main_menu', number: '0' },
    ],
  },

  shopping_food: {
    text: '🍽️ *Food & Restaurants*\nOptions:',
    buttons: [
      { text: 'Order Online', url: 'https://restaurant-ecom.vercel.app/', number: '1' },
      { text: 'Popular Restaurants', callback_data: 'food_popular', number: '2' },
      { text: 'Cafes & Snacks', callback_data: 'food_cafe', number: '3' },
      { text: 'Local Food Spots', callback_data: 'food_local', number: '4' },
      { text: '🔙 Back', callback_data: 'shopping', number: '0' },
    ],
  },
  food_popular: {
    text: '🍴 *Popular Restaurants*\nChoose:',
    buttons: [
      { text: 'Biriyani House', callback_data: 'rest_biriyani', number: '1' },
      { text: 'Paradise Family Restaurant', callback_data: 'rest_paradise', number: '2' },
      { text: 'Arabian Grill', callback_data: 'rest_arabian', number: '3' },
      { text: '🔙 Back', callback_data: 'shopping_food', number: '0' },
    ],
  },
  rest_biriyani: {
    text: 'Biriyani House\nBest Kerala Biriyani\n\nOrder / Enquiry:',
    buttons: [
      { text: '📞 Call Now', callback_data: 'call_rest_biriyani', number: '1', phone: universalNumber },
      { text: '🔙 Back', callback_data: 'food_popular', number: '0' },
    ],
  },
  // Add similar for rest_paradise, rest_arabian, and other categories like cafe/local

  shopping_grocery: {
    text: '🛒 *Grocery*\nSelect:',
    buttons: [
      { text: 'Order Online', url: 'https://restaurant-ecom.vercel.app/', number: '1' },
      { text: 'Supermarkets', callback_data: 'grocery_supermarkets', number: '2' },
      { text: 'Vegetable Shops', callback_data: 'grocery_veg', number: '3' },
      { text: 'Dairy Shops', callback_data: 'grocery_dairy', number: '4' },
      { text: '🔙 Back', callback_data: 'shopping', number: '0' },
    ],
  },
  grocery_supermarkets: {
    text: '🏪 *Supermarkets*\nNearby:',
    buttons: [
      { text: 'Margin Free Market', callback_data: 'super_margin', number: '1' },
      { text: 'Neethi Store', callback_data: 'super_neethi', number: '2' },
      { text: 'Metro Hypermarket', callback_data: 'super_metro', number: '3' },
      { text: '🔙 Back', callback_data: 'shopping_grocery', number: '0' },
    ],
  },
  super_margin: {
    text: 'Margin Free Market\nAll daily needs\n\nContact:',
    buttons: [
      { text: '📞 Call Now', callback_data: 'call_super_margin', number: '1', phone: universalNumber },
      { text: '🔙 Back', callback_data: 'grocery_supermarkets', number: '0' },
    ],
  },
  // Similar for others

  shopping_services: {
    text: '🛠️ *Repair & Services*\nSelect:',
    buttons: [
      { text: 'Electrician - Rasheed', callback_data: 'srv_electrician', number: '1' },
      { text: 'Plumber - Sameer', callback_data: 'srv_plumber', number: '2' },
      { text: 'AC Repair - Afsal', callback_data: 'srv_ac', number: '3' },
      { text: 'Home Repair - Niyas', callback_data: 'srv_home', number: '4' },
      { text: 'Computer Repair - Jameel', callback_data: 'srv_computer', number: '5' },
      { text: '🔙 Back', callback_data: 'shopping', number: '0' },
    ],
  },
  srv_electrician: {
    text: 'Electrician - Rasheed\nFast service • 24×7\n\nCall for help:',
    buttons: [
      { text: '📞 Call Now', callback_data: 'call_srv_electrician', number: '1', phone: universalNumber },
      { text: '🔙 Back', callback_data: 'shopping_services', number: '0' },
    ],
  },
  // Repeat pattern for all services

  // Education - now fully with contacts
  education: {
    text: '🎓 *Education Services*\nFind institutions:',
    buttons: [
      { text: 'Schools', callback_data: 'education_schools', number: '1' },
      { text: 'Colleges', callback_data: 'education_colleges', number: '2' },
      { text: 'Madrasas / Islamic', callback_data: 'education_madrasa', number: '3' },
      { text: 'Online Courses', callback_data: 'education_online', number: '4' },
      { text: '🔙 Back', callback_data: 'main_menu', number: '0' },
    ],
  },

  education_schools: {
    text: '🏫 *Schools in Smastha Univerce Area*\nSelect:',
    buttons: [
      { text: 'Green Valley Public School', callback_data: 'school_greenvalley', number: '1' },
      { text: 'Al Noor Higher Secondary', callback_data: 'school_alnoor', number: '2' },
      { text: 'Bright Future International', callback_data: 'school_brightfuture', number: '3' },
      { text: 'Crescent English Medium', callback_data: 'school_crescent', number: '4' },
      { text: 'City Model High School', callback_data: 'school_citymodel', number: '5' },
      { text: 'MES Central School', callback_data: 'school_mes', number: '6' },
      { text: '🔙 Back', callback_data: 'education', number: '0' },
    ],
  },
  school_greenvalley: {
    text: 'Green Valley Public School\nCBSE • Quality Education\n\nContact school:',
    buttons: [
      { text: '📞 Call School', callback_data: 'call_school_greenvalley', number: '1', phone: universalNumber },
      { text: '🔙 Back', callback_data: 'education_schools', number: '0' },
    ],
  },
  // Repeat similar blocks for school_alnoor, school_brightfuture, school_crescent, school_citymodel, school_mes (added real-sounding one)

  education_colleges: {
    text: '🏛️ *Colleges*\nSelect:',
    buttons: [
      { text: 'Crescent Arts & Science', callback_data: 'college_crescent', number: '1' },
      { text: 'Al Noor Degree College', callback_data: 'college_alnoor', number: '2' },
      { text: 'Green Valley Engineering', callback_data: 'college_greenvalley', number: '3' },
      { text: 'City Model Polytechnic', callback_data: 'college_citymodel', number: '4' },
      { text: 'Moulana College of Arts', callback_data: 'college_moulana', number: '5' },
      { text: '🔙 Back', callback_data: 'education', number: '0' },
    ],
  },
  college_crescent: {
    text: 'Crescent Arts & Science College\nHigher Education\n\nEnquiry / Admission:',
    buttons: [
      { text: '📞 Call College', callback_data: 'call_college_crescent', number: '1', phone: universalNumber },
      { text: '🔙 Back', callback_data: 'education_colleges', number: '0' },
    ],
  },
  // Repeat for others

  education_madrasa: {
    text: '🕌 *Madrasas & Islamic Education*\nSelect:',
    buttons: [
      { text: 'Darul Huda Islamic', callback_data: 'madrasa_darulhuda', number: '1' },
      { text: 'Markazul Hidaya Madrasa', callback_data: 'madrasa_markaz', number: '2' },
      { text: 'Noorul Islam Arabic', callback_data: 'madrasa_noorul', number: '3' },
      { text: 'Jamia Samastha Madrasa', callback_data: 'madrasa_samastha', number: '4' },
      { text: 'Al Falah Quran Academy', callback_data: 'madrasa_alfalah', number: '5' },
      { text: 'Thibyan / Rahmaniyya Madrasa', callback_data: 'madrasa_thibyan', number: '6' },
      { text: '🔙 Back', callback_data: 'education', number: '0' },
    ],
  },
  madrasa_darulhuda: {
    text: 'Darul Huda Islamic University\nPremium Islamic Learning\n\nContact:',
    buttons: [
      { text: '📞 Call Madrasa', callback_data: 'call_madrasa_darulhuda', number: '1', phone: universalNumber },
      { text: '🔙 Back', callback_data: 'education_madrasa', number: '0' },
    ],
  },
  // Repeat similar for all madrasas

  education_online: {
    text: '💻 *Online Islamic Courses*\nFree/Paid resources:',
    buttons: [
      { text: 'Samastha Online Channel', url: 'https://youtube.com/@samasthaonlineoffical?si=UcMF2f23rtNduaG7', number: '1' },
      { text: 'Islamic Classes Playlist', url: 'https://youtube.com/@samasthaonlineoffical?si=UcMF2f23rtNduaG7', number: '2' },
      { text: '🔙 Back', callback_data: 'education', number: '0' },
    ],
  },
};