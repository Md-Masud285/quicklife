export interface DistrictThanaMap {
  [district: string]: string[];
}

export const BANGLADESH_LOCATIONS: DistrictThanaMap = {
  // --- DHAKA DIVISION (১৩টি জেলা) ---
  'Dhaka (ঢাকা)': [
    'Dhanmondi (ধানমন্ডি)', 'Mirpur (মিরপুর)', 'Gulshan (গুলশান)', 'Banani (বনানী)', 
    'Uttara (উত্তরা)', 'Mohammadpur (মোহাম্মদপুর)', 'Motijheel (মতিঝিল)', 'Old Dhaka / Lalbagh (লালবাগ)', 
    'Badda (বাড্ডা)', 'Khilgaon (খিলগাঁও)', 'Jatrabari (যাত্রাবাড়ী)', 'Paltan (পল্টন)', 
    'Shahbagh (শাহবাগ)', 'Tejgaon (তেজগাঁও)', 'Ramna (রমনা)', 'Savar (সাভার)', 
    'Keraniganj (কেরানীগঞ্জ)', 'Dhamrai (ধামরাই)', 'Nawabganj (নবাবগঞ্জ)', 'Dohar (দোহার)'
  ],
  'Gazipur (গাজীপুর)': [
    'Gazipur Sadar (গাজীপুর সদর)', 'Tongi (টঙ্গী)', 'Kaliakair (কালিয়াকৈর)', 
    'Sreepur (শ্রীপুর)', 'Kapasia (কাপাসিয়া)', 'Kaliganj (কালীগঞ্জ)'
  ],
  'Narayanganj (নারায়ণগঞ্জ)': [
    'Narayanganj Sadar (নারায়ণগঞ্জ সদর)', 'Bandar (বন্দর)', 'Fatullah (ফতুল্লা)', 
    'Siddhirganj (সিদ্ধিরগঞ্জ)', 'Rupganj (রূপগঞ্জ)', 'Sonargaon (সোনারগাঁও)', 'Araihazar (আড়াইহাজার)'
  ],
  'Tangail (টাঙ্গাইল)': [
    'Tangail Sadar (টাঙ্গাইল সদর)', 'Mirzapur (মির্জাপুর)', 'Ghatail (ঘাটাইল)', 
    'Madhupur (মধুপুর)', 'Gopalpur (গোপালপুর)', 'Sakhipur (সখিপুর)', 'Kalihati (কালিহাতী)', 
    'Delduar (দেলদুয়ার)', 'Basail (বাসাইল)', 'Nagarpur (নাগরপুর)', 'Bhuapur (ভূঞাপুর)', 'Dhanbari (ধনবাড়ী)'
  ],
  'Narsingdi (নরসিংদী)': [
    'Narsingdi Sadar (নরসিংদী সদর)', 'Palash (পলাশ)', 'Shibpur (শিবপুর)', 
    'Monohardi (মনোহরদী)', 'Belabo (বেলাবো)', 'Raipura (রায়পুরা)'
  ],
  'Faridpur (ফরিদপুর)': [
    'Faridpur Sadar (ফরিদপুর সদর)', 'Bhanga (ভাঙ্গা)', 'Boalmari (বোয়ালমারী)', 
    'Nagarkanda (নগরকান্দা)', 'Madhukhali (মধুখালী)', 'Sadarpur (সদরপুর)', 
    'Alfadanga (আলফাডাঙ্গা)', 'Charbhadrasan (চরভদ্রাসন)', 'Saltha (সালথা)'
  ],
  'Gopalganj (গোপালগঞ্জ)': [
    'Gopalganj Sadar (গোপালগঞ্জ সদর)', 'Kashiani (কাশিয়ানী)', 'Kotalipara (কোটালীপাড়া)', 
    'Muksudpur (মুকসুদপুর)', 'Tungipara (টুঙ্গিপাড়া)'
  ],
  'Kishoreganj (কিশোরগঞ্জ)': [
    'Kishoreganj Sadar (কিশোরগঞ্জ সদর)', 'Bhairab (ভৈরব)', 'Bajitpur (বাজিতপুর)', 
    'Kulliarchar (কুলিয়ারচর)', 'Katiadi (কটিয়াদী)', 'Karimganj (করিমগঞ্জ)', 
    'Hossainpur (হোসেনপুর)', 'Pakundia (পাকুন্দিয়া)', 'Tarail (তাড়াইল)', 
    'Nikli (নিকলী)', 'Austagram (অষ্টগ্রাম)', 'Mithamoin (মিঠামইন)', 'Itna (ইটনা)'
  ],
  'Madaripur (মাদারীপুর)': [
    'Madaripur Sadar (মাদারীপুর সদর)', 'Shibchar (শিবচর)', 'Kalkini (কালকিনি)', 
    'Rajoir (রাজৈর)', 'Dasar (ডাসার)'
  ],
  'Manikganj (মানিকগঞ্জ)': [
    'Manikganj Sadar (মানিকগঞ্জ সদর)', 'Singair (সিংগাইর)', 'Saturia (সাটুরিয়া)', 
    'Shivalaya (শিবালয়)', 'Ghior (ঘিওরে)', 'Harirampur (হরিরামপুর)', 'Daulatpur (দৌলতপুর)'
  ],
  'Munshiganj (মুন্সীগঞ্জ)': [
    'Munshiganj Sadar (মুন্সীগঞ্জ সদর)', 'Sreenagar (শ্রীনগর)', 'Sirajdikhan (সিরাজদিখান)', 
    'Louhajang (লৌহজং)', 'Tongibari (টংগিবাড়ী)', 'Gazaria (গজারিয়া)'
  ],
  'Rajbari (রাজবাড়ী)': [
    'Rajbari Sadar (রাজবাড়ী সদর)', 'Pangsha (পাংশা)', 'Baliakandi (বালিয়াকান্দি)', 
    'Goalanda (গোয়ালন্দ)', 'Kalukhali (কালুখালী)'
  ],
  'Shariatpur (শরীয়তপুর)': [
    'Shariatpur Sadar (শরীয়তপুর সদর)', 'Naria (নড়িয়া)', 'Zajira (জাজিরা)', 
    'Bhedarganj (ভেদরগঞ্জ)', 'Damudya (ডামুড্যা)', 'Gosairhat (গোসাইরহাট)'
  ],

  // --- CHATTOGRAM DIVISION (১১টি জেলা) ---
  'Chattogram (চট্টগ্রাম)': [
    'Kotwali (কোতোয়ালী)', 'Panchlaish (পাঁচলাইশ)', 'Double Mooring (ডাবল মুরিং)', 
    'Halishahar (হালিশহর)', 'Patenga (পতেঙ্গা)', 'Khulshi (খুলশী)', 'Bakalia (বাকলিয়া)', 
    'Hathazari (হাটহাজারী)', 'Raozan (রাউজান)', 'Sitakunda (সীতাকুণ্ড)', 'Fatikchhari (ফটিকছড়ি)', 
    'Patiya (পটিয়া)', 'Boalkhali (বোয়ালখালী)', 'Anwara (আনোয়ারা)', 'Chandanaish (চন্দনাইশ)', 
    'Lohagara (লোহাগাড়া)', 'Satkania (সাতকানিয়া)', 'Banshkhali (বাঁশখালী)', 'Mirsarai (মীরসরাই)', 'Sandwip (সন্দ্বীপ)'
  ],
  'Cox\'s Bazar (কক্সবাজার)': [
    'Cox\'s Bazar Sadar (কক্সবাজার সদর)', 'Ramu (রামু)', 'Chakaria (চকোরিয়া)', 
    'Teknaf (টেকনাফ)', 'Ukhia (উখিয়া)', 'Pekua (পেকুয়া)', 'Kutubdia (কুতুবদিয়া)', 
    'Moheshkhali (মহেশখালী)', 'Eidgaon (ঈদগাঁও)'
  ],
  'Cumilla (কুমিল্লা)': [
    'Cumilla Adarsha Sadar (আদর্শ সদর)', 'Cumilla Sadar Dakshin (সদর দক্ষিণ)', 'Daudkandi (দাউদকান্দি)', 
    'Chandina (চান্দিনা)', 'Burichang (বুড়িচং)', 'Debidwar (দেবিদ্বার)', 'Laksam (লাকসাম)', 
    'Muradnagar (মুরাদনগর)', 'Homna (হোমনা)', 'Titas (তিতাস)', 'Meghna (মেঘনা)', 
    'Barura (বরুড়া)', 'Brahmanpara (ব্রাহ্মণপাড়া)', 'Chauddagram (চৌদ্দগ্রাম)', 
    'Monoharganj (মনোহরগঞ্জ)', 'Nangalkot (নাঙ্গলকোট)', 'Lalmai (লালমাই)'
  ],
  'Brahmanbaria (ব্রাহ্মণবাড়িয়া)': [
    'Brahmanbaria Sadar (ব্রাহ্মণবাড়িয়া সদর)', 'Ashuganj (আশুগঞ্জ)', 'Sarail (সরাইল)', 
    'Kasba (কসবা)', 'Akhaura (আখাউড়া)', 'Nabinagar (নবীনগর)', 'Bancharampur (বাঞ্ছারামপুর)', 
    'Nasirnagar (নাসিরনগর)', 'Bijoynagar (বিজয়নগর)'
  ],
  'Chandpur (চাঁদপুর)': [
    'Chandpur Sadar (চাঁদপুর সদর)', 'Hajiganj (হাজীগঞ্জ)', 'Faridganj (ফরিদগঞ্জ)', 
    'Matlab Uttar (মতলব উত্তর)', 'Matlab Dakshin (মতলব দক্ষিণ)', 'Shahrasti (শাহরাস্তি)', 
    'Kachua (কচুয়া)', 'Haimchar (হাইমচর)'
  ],
  'Noakhali (নোয়াখালী)': [
    'Noakhali Sadar (নোয়াখালী সদর/সুধারাম)', 'Begumganj (বেগমগঞ্জ)', 'Companiganj (কোম্পানীগঞ্জ)', 
    'Chatkhil (চাটখিল)', 'Senbagh (সেনবাগ)', 'Hatiya (হাতিয়া)', 'Kabirhat (কবিরহাট)', 
    'Sonaimuri (সোনাইমুড়ী)', 'Subarnachar (সুবর্ণচর)'
  ],
  'Feni (ফেনী)': [
    'Feni Sadar (ফেনী সদর)', 'Chhagalnaiya (ছাগলনাইয়া)', 'Daganbhuiyan (দাগনভূঞা)', 
    'Parshuram (পরশুরাম)', 'Fulgazi (ফুলগাজী)', 'Sonagazi (সোনাগাজী)'
  ],
  'Lakshmipur (লক্ষ্মীপুর)': [
    'Lakshmipur Sadar (লক্ষ্মীপুর সদর)', 'Raipur (রায়পুর)', 'Ramganj (রামগঞ্জ)', 
    'Ramgati (রামগতি)', 'Kamalnagar (কমলনগর)'
  ],
  'Bandarban (বান্দরবান)': [
    'Bandarban Sadar (বান্দরবান সদর)', 'Ruma (রুমা)', 'Thanchi (থানচি)', 
    'Rowangchhari (রোয়াংছড়ি)', 'Lama (লামা)', 'Alikadam (আলীকদম)', 'Naikhongchhari (নাইক্ষ্যংছড়ি)'
  ],
  'Khagrachhari (খাগড়াছড়ি)': [
    'Khagrachhari Sadar (খাগড়াছড়ি সদর)', 'Dighinala (দিঘীনালা)', 'Panchhari (পানছড়ি)', 
    'Mahalchhari (মহালছড়ি)', 'Matiranga (মাটিরাঙ্গা)', 'Manikchhari (মানিকছড়ি)', 
    'Ramgarh (রামগড়)', 'Lakshmichhari (লক্ষ্মীছড়ি)', 'Guimara (গুইমারা)'
  ],
  'Rangamati (রাঙ্গামাটি)': [
    'Rangamati Sadar (রাঙ্গামাটি সদর)', 'Kaptai (কাপ্তাই)', 'Baghaichhari (বাঘাইছড়ি)', 
    'Barkal (বরকল)', 'Langadu (লংগদু)', 'Rajasthali (রাজস্থলী)', 'Belaichhari (বিলাইছড়ি)', 
    'Juraichhari (জুরাইছড়ি)', 'Naniarchar (নানিয়ারচর)', 'Kaukhali (কাউখালী)'
  ],

  // --- RAJSHAHI DIVISION (৮টি জেলা) ---
  'Rajshahi (রাজশাহী)': [
    'Boalia (বোয়ালিয়া)', 'Rajpara (রাজপাড়া)', 'Motihar (মতিহার)', 'Shah Makhdum (শাহ মখদুম)', 
    'Paba (পবা)', 'Godagari (গোদাগাড়ী)', 'Tanore (তানোর)', 'Bagha (বাঘা)', 
    'Charghat (চারঘাট)', 'Puthia (পুঠিয়া)', 'Durgapur (দুর্গাপুর)', 'Bagmara (বাগমারা)', 'Mohanpur (মোহনপুর)'
  ],
  'Bogura (বগুড়া)': [
    'Bogura Sadar (বগুড়া সদর)', 'Shajahanpur (শাজাহানপুর)', 'Sherpur (শেরপুর)', 
    'Shibganj (শিবগঞ্জ)', 'Gabtali (গাবতলী)', 'Kahalu (কাহালু)', 'Nandigram (নন্দীগ্রাম)', 
    'Dhunat (ধুনট)', 'Sariakandi (সারিয়াকান্দি)', 'Sonatala (সোনাতলা)', 'Adamdighi (আদমদিঘী)', 'Dupchanchia (দুপচাঁচিয়া)'
  ],
  'Pabna (পাবনা)': [
    'Pabna Sadar (পাবনা সদর)', 'Ishwardi (ঈশ্বরদী)', 'Sujanagar (সুজানগর)', 
    'Santhia (সাঁথিয়া)', 'Chatmohar (চাটমোহর)', 'Bera (বেড়া)', 'Bhangura (ভাঙ্গুড়া)', 
    'Faridpur (ফরিদপুর)', 'Atgharia (আটঘরিয়া)'
  ],
  'Sirajganj (সিরাজগঞ্জ)': [
    'Sirajganj Sadar (সিরাজগঞ্জ সদর)', 'Shahjadpur (শাহজাদপুর)', 'Ullapara (উল্লাপাড়া)', 
    'Belkuchi (বেলকুচি)', 'Kazipur (কাজীপুর)', 'Kamarkhanda (কামারখন্দ)', 
    'Raiganj (রায়গঞ্জ)', 'Tarash (তাড়াশ)', 'Chauhali (চৌহালী)'
  ],
  'Naogaon (নওগাঁ)': [
    'Naogaon Sadar (নওগাঁ সদর)', 'Patnitala (পত্নীতলা)', 'Dhamoirhat (ধামইরহাট)', 
    'Mohadevpur (মহাদেবপুর)', 'Manda (মান্দা)', 'Niamatpur (নিয়ামতপুর)', 
    'Sapahar (সাপাহার)', 'Porsha (পোরশা)', 'Raninagar (রাণীনগর)', 'Atrai (আত্রাই)', 'Badalgachhi (বদলগাছী)'
  ],
  'Natore (নাটোর)': [
    'Natore Sadar (নাটোর সদর)', 'Singra (সিংড়া)', 'Baraigram (বড়াইগ্রাম)', 
    'Gurudaspur (গুরুদাসপুর)', 'Lalpur (লালপুর)', 'Bagatipara (বাগাতিপাড়া)', 'Naldanga (নলডাঙ্গা)'
  ],
  'Chapai Nawabganj (চাঁপাইনবাবগঞ্জ)': [
    'Chapai Nawabganj Sadar (চাঁপাইনবাবগঞ্জ সদর)', 'Shibganj (শিবগঞ্জ)', 
    'Gomastapur (গোমস্তাপুর)', 'Nachole (নাচোল)', 'Bholahat (ভোলাহাট)'
  ],
  'Joypurhat (জয়পুরহাট)': [
    'Joypurhat Sadar (জয়পুরহাট সদর)', 'Panchbibi (পাঁচবিবি)', 'Kalai (কালাই)', 
    'Khetlal (ক্ষেতলাল)', 'Akkelpur (আক্কেলপুর)'
  ],

  // --- KHULNA DIVISION (১০টি জেলা) ---
  'Khulna (খুলনা)': [
    'Khulna Sadar (খুলনা সদর)', 'Sonadanga (সোনাডাঙ্গা)', 'Khalishpur (খালিশপুর)', 
    'Daulatpur (দৌলতপুর)', 'Khan Jahan Ali (খান জাহান আলী)', 'Dumuria (ডুমুরিয়া)', 
    'Rupsha (রূপসা)', 'Phultala (ফুলতলা)', 'Batiaghata (বটিয়াঘাটা)', 'Dacope (দাকোপ)', 
    'Paikgachha (পাইকগাছা)', 'Koyra (কয়রা)', 'Terokhada (তেরখাদা)', 'Dighalia (দিঘলিয়া)'
  ],
  'Jashore (যশোর)': [
    'Jashore Sadar (যশোর সদর)', 'Jhikargachha (ঝিকরগাছা)', 'Sharsha (শার্শা/বেনাপোল)', 
    'Manirampur (মণিরামপুর)', 'Keshabpur (কেশবপুর)', 'Abhaynagar (অভয়নগর)', 
    'Bagherpara (বাঘারপাড়া)', 'Chaugachha (চৌগাছা)'
  ],
  'Kushtia (কুষ্টিয়া)': [
    'Kushtia Sadar (কুষ্টিয়া সদর)', 'Kumarkhali (কুমারখালী)', 'Bheramara (ভেড়ামারা)', 
    'Mirpur (মিরপুর)', 'Daulatpur (দৌলতপুর)', 'Khoksa (খোকসা)'
  ],
  'Jhenaidah (ঝিনাইদহ)': [
    'Jhenaidah Sadar (ঝিনাইদহ সদর)', 'Kaliganj (কালীগঞ্জ)', 'Kotchandpur (কোটচাঁদপুর)', 
    'Maheshpur (মহেশপুর)', 'Shailkupa (শৈলকূপা)', 'Harinakunda (হরিণাকুণ্ডু)'
  ],
  'Satkhira (সাতক্ষীরা)': [
    'Satkhira Sadar (সাতক্ষীরা সদর)', 'Kalaroa (কলারোয়া)', 'Tala (তালা)', 
    'Kaliganj (কালীগঞ্জ)', 'Shyamnagar (শ্যামনগর)', 'Assasuni (আশাশুনি)', 'Debhata (দেবহাটা)'
  ],
  'Bagerhat (বাগেরহাট)': [
    'Bagerhat Sadar (বাগেরহাট সদর)', 'Mongla (মোংলা)', 'Fakirhat (ফকিরহাট)', 
    'Rampal (রামপাল)', 'Morrelganj (মোড়েলগঞ্জ)', 'Sarankhola (শরণখোলা)', 
    'Kachua (কচুয়া)', 'Mollahat (মোল্লাহাট)', 'Chitalmari (চিতলমারী)'
  ],
  'Chuadanga (চুয়াডাঙ্গা)': [
    'Chuadanga Sadar (চুয়াডাঙ্গা সদর)', 'Alamdanga (আলমডাঙ্গা)', 
    'Damurhuda (দামুড়হুদা)', 'Jibannagar (জীবননগর)'
  ],
  'Magura (মাগুরা)': [
    'Magura Sadar (মাগুরা সদর)', 'Sreepur (শ্রীপুর)', 'Shalikha (শালিখা)', 'Mohammadpur (মহম্মদপুর)'
  ],
  'Meherpur (মেহেরপুর)': [
    'Meherpur Sadar (মেহেরপুর সদর)', 'Gangni (গাংনী)', 'Mujibnagar (মুজিবনগর)'
  ],
  'Narail (নড়াইল)': [
    'Narail Sadar (নড়াইল সদর)', 'Lohagara (লোহাগড়া)', 'Kalia (কালিয়া)'
  ],

  // --- BARISHAL DIVISION (৬টি জেলা) ---
  'Barishal (বরিশাল)': [
    'Barishal Sadar / Kotwali (কোতোয়ালী সদর)', 'Babuganj (বাবুগঞ্জ)', 'Bakerganj (বাকেরগঞ্জ)', 
    'Gournadi (গৌরনদী)', 'Uzirpur (উজিরপুর)', 'Banaripara (বানারীপাড়া)', 
    'Agailjhara (আগৈলঝাড়া)', 'Muladi (মুলাদী)', 'Hizla (হিজলা)', 'Mehendiganj (মেহেন্দীগঞ্জ)'
  ],
  'Bhola (ভোলা)': [
    'Bhola Sadar (ভোলা সদর)', 'Borhanuddin (বোরহানউদ্দিন)', 'Char Fasson (চরফ্যাশন)', 
    'Lalmohan (লালমোহন)', 'Daulatkhan (দৌলতখান)', 'Tazumuddin (তজুমদ্দিন)', 'Manpura (মনপুরা)'
  ],
  'Patuakhali (পটুয়াখালী)': [
    'Patuakhali Sadar (পটুয়াখালী সদর)', 'Galachipa (গলাচিপা)', 'Kalapara / Kuakata (কলাপাড়া/কুয়াকাটা)', 
    'Bauphal (বাউফল)', 'Dashmina (দশমিনা)', 'Mirzaganj (মির্জাগঞ্জ)', 'Dumki (দুমকি)', 'Rangabali (রাঙ্গাবালী)'
  ],
  'Pirojpur (পিরোজপুর)': [
    'Pirojpur Sadar (পিরোজপুর সদর)', 'Mathbaria (মঠবাড়িয়া)', 'Bhandaria (ভাণ্ডারিয়া)', 
    'Nesarabad / Swarupkati (নেছারাবাদ)', 'Nazirpur (নাজিরপুর)', 'Kawkhali (কাউখালী)', 'Indurkani (ইন্দুরকানী)'
  ],
  'Barguna (বরগুনা)': [
    'Barguna Sadar (বরগুনা সদর)', 'Amtali (আমতলী)', 'Patharghata (পাথরঘাটা)', 
    'Betagi (বেতাগী)', 'Bamna (বামনা)', 'Taltali (তালতলী)'
  ],
  'Jhalokathi (ঝালকাঠি)': [
    'Jhalokathi Sadar (ঝালকাঠি সদর)', 'Nalchity (নলছিটি)', 'Rajapur (রাজাপুর)', 'Kathalia (কাঠালিয়া)'
  ],

  // --- SYLHET DIVISION (৪টি জেলা) ---
  'Sylhet (সিলেট)': [
    'Sylhet Sadar / Kotwali (কোতোয়ালী সদর)', 'South Surma (দক্ষিণ সুরমা)', 'Beanibazar (বিয়ানীবাজার)', 
    'Golapganj (গোলাপগঞ্জ)', 'Biswanath (বিশ্বনাথ)', 'Zakiganj (জকিগঞ্জ)', 'Kanaighat (কানাইঘাট)', 
    'Gowainghat (গোয়াইনঘাট)', 'Jaintiapur (জৈন্তাপুর)', 'Companiganj (কোম্পানীগঞ্জ)', 
    'Fenchuganj (ফেঞ্চুগঞ্জ)', 'Balaganj (বালাগঞ্জ)', 'Osmani Nagar (ওসমানী নগর)'
  ],
  'Moulvibazar (মৌলভীবাজার)': [
    'Moulvibazar Sadar (মৌলভীবাজার সদর)', 'Sreemangal (শ্রীমঙ্গল)', 'Kamalganj (কমলগঞ্জ)', 
    'Kulaura (কুলাউড়া)', 'Barlekha (বড়লেখা)', 'Juri (জুড়ী)', 'Rajnagar (রাজনগর)'
  ],
  'Habiganj (হবিগঞ্জ)': [
    'Habiganj Sadar (হবিগঞ্জ সদর)', 'Madhabpur (মাধবপুর)', 'Chunarughat (চুনারুঘাট)', 
    'Bahubal (বাহুবল)', 'Nabiganj (নবীগঞ্জ)', 'Baniachong (বানিয়াচং)', 
    'Lakhai (লাখাই)', 'Ajmiriganj (আজমিরীগঞ্জ)', 'Sayestaganj (শায়েস্তাগঞ্জ)'
  ],
  'Sunamganj (সুনামগঞ্জ)': [
    'Sunamganj Sadar (সুনামগঞ্জ সদর)', 'Chhatak (ছাতক)', 'Jagannathpur (জগন্নাথপুর)', 
    'Derai (দিরাই)', 'Tahirpur (তাহিরপুর)', 'Jamalganj (জামালগঞ্জ)', 
    'Dowarabazar (দোয়ারাবাজার)', 'Sullah (শাল্লা)', 'Dharampasha (ধর্মপাশা)', 
    'Bishwamvarpur (বিশ্বম্ভরপুর)', 'Shantiganj (শান্তিগঞ্জ)', 'Madhyanagar (মধ্যনগর)'
  ],

  // --- RANGPUR DIVISION (৮টি জেলা) ---
  'Rangpur (রংপুর)': [
    'Rangpur Sadar / Kotwali (কোতোয়ালী সদর)', 'Badarganj (বদরগঞ্জ)', 'Pirganj (পীরগঞ্জ)', 
    'Mithapukur (মিঠাপুকুর)', 'Gangachara (গংগাচড়া)', 'Kaunia (কাউনিয়া)', 
    'Pirgachha (পীরগাছা)', 'Taraganj (তারাগঞ্জ)'
  ],
  'Dinajpur (দিনাজপুর)': [
    'Dinajpur Sadar (দিনাজপুর সদর)', 'Birganj (বীরগঞ্জ)', 'Birampur (বিরামপুর)', 
    'Phulbari (ফুলবাড়ী)', 'Parbatipur (পার্বতীপুর)', 'Hakimpur / Hili (হাকিমপুর/হিলি)', 
    'Bochaganj (বোচাগঞ্জ)', 'Kaharole (কাহারোল)', 'Khansama (খানসামা)', 
    'Chirirbandar (চিরিরবন্দর)', 'Ghoraghat (ঘোড়াঘাট)', 'Nawabganj (নবাবগঞ্জ)', 'Birol (বিরল)'
  ],
  'Kurigram (কুড়িগ্রাম)': [
    'Kurigram Sadar (কুড়িগ্রাম সদর)', 'Nageshwari (নাগেশ্বরী)', 'Bhurungamari (ভুরুঙ্গামারী)', 
    'Ulipur (উলিপুর)', 'Chilmari (চিলমারী)', 'Rajarhat (রাজারহাট)', 
    'Roumari (রৌমারী)', 'Rajibpur (রাজিবপুর)', 'Phulbari (ফুলবাড়ী)'
  ],
  'Gaibandha (গাইবান্ধা)': [
    'Gaibandha Sadar (গাইবান্ধা সদর)', 'Gobindaganj (গোবিন্দগঞ্জ)', 'Sundarganj (সুন্দরগঞ্জ)', 
    'Palashbari (পলাশবাড়ী)', 'Sadullapur (সাদুল্লাপুর)', 'Saghata (সাঘাটা)', 'Phulchhari (ফুলছড়ি)'
  ],
  'Nilphamari (নীলফামারী)': [
    'Nilphamari Sadar (নীলফামারী সদর)', 'Saidpur (সৈয়দপুর)', 'Domar (ডোমার)', 
    'Dimla (ডিমলা)', 'Jaldhaka (জলঢাকা)', 'Kishoreganj (কিশোরগঞ্জ)'
  ],
  'Thakurgaon (ঠাকুরগাঁও)': [
    'Thakurgaon Sadar (ঠাকুরগাঁও সদর)', 'Pirganj (পীরগঞ্জ)', 'Rani Sankail (রাণীশংকৈল)', 
    'Baliadangi (বালিয়াডাঙ্গী)', 'Haripur (হরিপুর)'
  ],
  'Lalmonirhat (লালমনিরহাট)': [
    'Lalmonirhat Sadar (লালমনিরহাট সদর)', 'Hatibandha (হাতীবান্ধা)', 'Patgram / Burimari (পাটগ্রাম/বুড়িমারী)', 
    'Aditmari (আদিতমারী)', 'Kaliganj (কালীগঞ্জ)'
  ],
  'Panchagarh (পঞ্চগড়)': [
    'Panchagarh Sadar (পঞ্চগড় সদর)', 'Tetulia (তেঁতুলিয়া)', 'Boda (বোদা)', 
    'Debiganj (দেবীগঞ্জ)', 'Atwari (আটোয়ারী)'
  ],

  // --- MYMENSINGH DIVISION (৪টি জেলা) ---
  'Mymensingh (ময়মনসিংহ)': [
    'Mymensingh Sadar / Kotwali (কোতোয়ালী সদর)', 'Muktagachha (মুক্তাগাছা)', 'Trishal (ত্রিশাল)', 
    'Bhaluka (ভালুকা)', 'Phulpur (ফুলপুর)', 'Gafargaon (গফরগাঁও)', 
    'Haluaghat (হালুয়াঘাট)', 'Gouripur (গৌরীপুর)', 'Ishwarganj (ঈশ্বরগঞ্জ)', 
    'Nandail (নান্দাইল)', 'Dhobaura (ধোবাউড়া)', 'Phulbaria (ফুলবাড়িয়া)', 'Tara Khanda (তারাকান্দা)'
  ],
  'Jamalpur (জামালপুর)': [
    'Jamalpur Sadar (জামালপুর সদর)', 'Dewanganj (দেওয়ানগঞ্জ)', 'Islampur (ইসলামপুর)', 
    'Madarganj (মাদারগঞ্জ)', 'Melandaha (মেলান্দহ)', 'Sarishabari (সরিষাবাড়ী)', 'Baksiganj (বকশীগঞ্জ)'
  ],
  'Netrokona (নেত্রকোণা)': [
    'Netrokona Sadar (নেত্রকোণা সদর)', 'Kendua (কেন্দুয়া)', 'Mohanganj (মোহনগঞ্জ)', 
    'Durgapur (দুর্গাপুর)', 'Kalmakanda (কলমাকান্দা)', 'Barhatta (বারহাট্টা)', 
    'Purbadhala (পূর্বধলা)', 'Atpara (আটপাড়া)', 'Madan (মদন)', 'Khaliajuri (খালিয়াজুরী)'
  ],
  'Sherpur (শেরপুর)': [
    'Sherpur Sadar (শেরপুর সদর)', 'Nalitabari (নালিতাবাড়ী)', 'Nakla (নকলা)', 
    'Sreebardi (শ্রীবরদী)', 'Jhenaigati (ঝিনাইগাতী)'
  ]
};

export const NATIONAL_EMERGENCY_NUMBERS = [
  { name: 'জাতীয় জরুরি সেবা (পুলিশ, অ্যাম্বুলেন্স, ফায়ার সার্ভিস)', number: '999', icon: 'ShieldAlert', color: 'from-red-600 to-rose-600' },
  { name: 'ফায়ার সার্ভিস ও সিভিল ডিফেন্স হটলাইন', number: '16163', icon: 'Flame', color: 'from-orange-600 to-amber-600' },
  { name: 'জাতীয় স্বাস্থ্য বাতায়ন (ফ্রি ডাক্তার পরামর্শ)', number: '16263', icon: 'HeartPulse', color: 'from-emerald-600 to-teal-600' },
  { name: 'সরকারি জরুরি অ্যাম্বুলেন্স সার্ভিস', number: '199', icon: 'Ambulance', color: 'from-blue-600 to-cyan-600' },
  { name: 'নারী ও শিশু নির্যাতন প্রতিরোধ হেল্পলাইন', number: '109', icon: 'UserCheck', color: 'from-purple-600 to-pink-600' },
  { name: 'জাতীয় দুর্যোগ বার্তা ও পূর্বাভাস', number: '1090', icon: 'AlertTriangle', color: 'from-yellow-600 to-orange-600' },
  { name: 'দুদক হটলাইন (দুর্নীতি দমন)', number: '106', icon: 'Lock', color: 'from-indigo-600 to-violet-600' }
];
