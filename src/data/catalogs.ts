export const majors = [
  'Computer Science','Software Engineering','Artificial Intelligence','Data Science','Computer Engineering','Information Systems',
  'Cybersecurity','Robotics','Electrical Engineering','Mechanical Engineering','Civil Engineering','Aerospace Engineering',
  'Physics','Mathematics','Statistics','Economics','Finance','Business Administration','Accounting','Marketing',
  'International Business','Management','Architecture','Industrial Design','Graphic Design','Biotechnology','Biology',
  'Chemistry','Medicine','Biomedical Engineering','Environmental Science','Political Science','International Relations',
  'Law','Psychology','Sociology','Communications','Journalism','Education','Linguistics','Pharmacy','Public Health'
];

export const countries = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Cape Verde','Central African Republic','Chad','Chile','China','Colombia','Comoros','Costa Rica','Croatia','Cyprus','Czechia','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan','Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
];

export const languageOptions = [
  {id:'en', label:'English'}, {id:'ru', label:'Русский'}, {id:'kk', label:'Қазақша'}, {id:'zh', label:'中文'}, {id:'de', label:'Deutsch'}, {id:'es', label:'Español'}
] as const;

export const majorAliases: Record<string,string[]> = {
  'Computer Science':['computer science','компьютерные науки','компьютерлік ғылым','计算机科学','informatik','ciencias de la computación'],
  'Software Engineering':['software engineering','программная инженерия','бағдарламалық инженерия','软件工程','softwareentwicklung','ingeniería de software'],
  'Artificial Intelligence':['artificial intelligence','искусственный интеллект','жасанды интеллект','人工智能','künstliche intelligenz','inteligencia artificial'],
  'Data Science':['data science','анализ данных','деректер ғылымы','数据科学','datenwissenschaft','ciencia de datos'],
  'Cybersecurity':['cybersecurity','кибербезопасность','киберқауіпсіздік','网络安全','cybersicherheit','ciberseguridad'],
  'Business Administration':['business','бизнес','бизнес басқару','工商管理','betriebswirtschaft','administración de empresas'],
};
