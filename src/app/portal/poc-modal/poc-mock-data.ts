export interface Supplier {
  name: string;
  description: string;
  logo: string;
}
export interface Product {
  name: string;
  logo: string;
  logoBig:string;
  id:number;
  details:string;
  region:string;
  type:string;
  timeframe:number;
  price:number,
  sofcopier:number,
  numusers:number,
  supplier?:string;
  ref_2_9?:boolean;
  ref_2_9b?:string[];
  ref_2_10?:string;
  ref_2_6_4?:boolean;
  ref_2_6_5?:string[];
  ref_2_6_3?:string;
  notification5?:string;

  compliance:number;
  usecase:string;
  anitbribery:number
  insurance:string[],
  personaldata:string

  insuranceLevel:[boolean,boolean,boolean,boolean]; //public, employee, cyber, full
  complianceLabel:string,
  membershipLabel:string,

  compareList:boolean;

}
export interface User{
  first:string,
  second:string,
  email:string,
  id:string
}
export interface Country{
  name:string,
  selected:boolean,
  id:number
}
export const MockProjects:string[] = ['Project1 ', 'Globility Projects']
export const  MockPocDataUsers: User[] = [
  {
    id:'1',
    first:'Joe',
    second:'Smith',
    email:'joe@gmail.com'
  },
  {
    id:'2',
    first:'Jessica',
    second:'Xa',
    email:'xa@ret.net'
  },
  {
    id:'3',
    first:'Helena',
    second:'Za',
    email:'helena11@rt.com'
  },
  {
    id:'4',
    first:'Alexander',
    second:'Pick',
    email:'aleksander@rt.com'
  },
  {
    id:'5',
    first:'Victoria',
    second:'First',
    email:'aleksander@rt.com'
  },
  {
    id:'6',
    first:'Xavier',
    second:'Aronx',
    email:'addef@net.net'
  },
  {
    id:'7',
    first:'Elisa',
    second:'Totor',
    email:'totor@yooho'
  },
  {
      id:'8',
      first:'Zack',
      second:'Dorougthater',
      email:'dorzen.k@ooop.biz'
  },
  {
      id:'9',
      first:'Baron',
      second:'Zet-Ereer',
      email:'errer@biz.uk'
  },
  {
      id:'10',
      first:'Xenia',
      second:'Ereer',
      email:'errer@biz.uk'
  },
  {
    id:'11',
    first:'Ryszard',
      second:'Leon',
      email:'rleon@companty-great.biz'
  },
  {
    id:'12',
    first:'Citaron',
    second:'Opppp-Ereer',
    email:'errer@biz.uk'
  },
  {
    id:'13',
    first:'Dearon',
    second:'Yablonski',
    email:'diablo@biz.uk'
  },
  {
    id:'14',
    first:'Milosch',
      second:'Etorenatera',
      email:'ethernet@com.uk'
  },
  {
    id:'15',
    first:'Gilly',
      second:'Italy',
      email:'motherrr@jota.op'
  },
  {
    id:'16',
    first:'Zack',
    second:'Albotros',
    email:'sxxs@jz.dr'
  },
  {
    id:'17',
    first:'Andrew',
    second:'Althen',
    email:'andrew@jz.dr'
  },
  {
      id:'18',
    first:'Anna',
    second:'Pickman',
    email:'anna.pickmna@yooho.com'
  },
  {
    id:'19',
    first:'Anna',
    second:'Green',
    email:'a.green@zet.uk.com'
  },
  {
      id:'20',
    first:'Aron',
    second:'Zero',
    email:'zaabottros@jotas_txt.fr'
  },
  {
    id:'21',
    first:'Aga',
    second:'Zytros',
    email:'zenek@atat.fr'
  },
  {
    id:'22',
    first:'Aghate',
    second:'Kristina',
    email:'aghate@accademy.dr'
  }

]
export const MockPocDataSuppliers: Supplier[] = [
  {
    name: 'Ryantec',
    description: 'Providing revolutionary resolutions for evolution.',
    // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
  },
  {
    name: 'Allied Controls',
    description: 'Providing revolutionary resolutions for evolution.',
    logo:'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
  },
  {
    name: 'Erguz Financial Advisors',
    description: 'Providing revolutionary resolutions for evolution.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
  },
  {
    name: 'Dera Capital Advisors',
    description: 'Specialists in capital advising',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
  },
  {
    name: 'Smartech Ltd',
    description: 'Specialists in capital advising',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
  },
  {
    name: 'KK Capital Advisors',
    description: 'Specialists in capital advising',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
  }
]
export const MockPocDataProducts: Product[] = [

  {
    id:0,
    name: 'Smoolee',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
    details:'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
    supplier:'Smartech Ltd',
    logoBig:'assets/img/logo_placeholder.png',
    ref_2_9:true,
    ref_2_9b:['United Kingdom','Singapore'],
    ref_2_10:'Restriction ISO-230',
    ref_2_6_4: true,
    ref_2_6_5:['licence 1', 'licence 2'],
    ref_2_6_3:'OracleMS1, Windows 10',
    notification5: '200',
    region:'United Kingdom',
    type:'BlockChain',
    timeframe:13,
    price:3100,
    sofcopier:10,
    numusers:40,
    compliance:76,
    anitbribery:99,
    usecase:'No',
    personaldata:'Yes',
    insurance:['2000','20000','20000'],



    insuranceLevel:[true,true,true,true],
    complianceLabel:'silver',
    membershipLabel:'core',

    compareList:false
  },
  {
    id:1,
    name: 'etherVox',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
    details:"Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    supplier:'Globility',
    logoBig:'assets/img/logo-products/g512.png',
    ref_2_9:false,
    ref_2_9b:[],
    ref_2_10:'Restriction ZZS',
    ref_2_6_4: false,
    ref_2_6_5:[],
    ref_2_6_3:'',
    notification5: '100',
    region:'United Kingdom',
    type: 'BlockChain',
    timeframe:15,
    price:8000,
    sofcopier:50,
    numusers:10,
    compliance:98,
    anitbribery:10,
    usecase:'Yes',
    personaldata:'No',
    insurance:['50','10000','Not yet'],



    complianceLabel:'golden',
    insuranceLevel:[true,true,false,false],
    membershipLabel:'core',

    compareList:false

  },
  {
    id:2,
    name: 'Data Analtytics',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
    supplier:'ABC Wordmark',
    details:'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
    logoBig:'assets/img/logo_placeholder.png',
    ref_2_9:true,
    ref_2_9b:['United Kingdom'],
    ref_2_10:'notofication 2a',
    ref_2_6_4: false,
    ref_2_6_5:[],
    ref_2_6_3:'OracleMS',
    notification5: '',
    region:'United Kingdom',
    type: 'Big Data',
    timeframe:45,
    price:3040,
    sofcopier:0,
    numusers:18,
    compliance:55,
    anitbribery:55,
    usecase:'Yes',
    personaldata:'Yes',
    insurance:['1000','Not yet','9900000'],


    complianceLabel:'bronze',
    insuranceLevel:[true,false,true, false],
    membershipLabel:'premium',

    compareList:false

  },
  {
    id:3,
    name: 'Dera Capital Advisors',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
    supplier:'Ryantec',
    details:'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
    logoBig:'assets/img/logo_placeholder.png',
    ref_2_9:true,
    ref_2_9b:['Singapore'],
    ref_2_10:'notofication 2',
    ref_2_6_4: true,
    ref_2_6_5:['licence 1', 'licence 2'],
    ref_2_6_3:'notification 4',
    notification5: '100',
    region:'Singapore',
    type: 'Machine Learning',
    timeframe:200,
    price:19990,
    sofcopier:500,
    numusers:87,
    compliance:59,
    anitbribery:90,
    usecase:'Yes',
    personaldata:'Yes',
    insurance:['15000','Not yet','Not yet'],


    complianceLabel:'bronze',
    insuranceLevel:[true,false,false, false],
    membershipLabel:'premium',

    compareList:false
  },
  {
    id:4,
    name: 'Dera Capital Advisors',
   logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
    supplier:'Ryantec',
    details:'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
    logoBig:'assets/img/logo-products/logo7.png',
    ref_2_9:true,
    ref_2_9b:['United States'],
    ref_2_10:'notofication 2',
    ref_2_6_4: true,
    ref_2_6_5:['licence 1', 'licence 2'],
    ref_2_6_3:'notification 4',
    notification5: '100',
    region:'United States',
    type: 'Robotic Process Automation (RPA)',
    timeframe:100,
    price:2500,
    sofcopier:200,
    numusers:31,
    compliance:79.2,
    anitbribery:31,
    usecase:'Yes',
    personaldata:'No',
    insurance:['Not yet','405000','Not yet'],

    complianceLabel:'silver',
    insuranceLevel:[false,true,false, false],
    membershipLabel:'core',

    compareList:false
  },
  {
    id:5,
    name: 'Dera Capital Advisors',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
    details:'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
    supplier:'Smart AP',
    logoBig:'assets/img/logo_placeholder.png',
    ref_2_9:true,
    ref_2_9b:['United States'],
    ref_2_10:'notofication 2',
    ref_2_6_4: true,
    ref_2_6_5:['licence 1', 'licence 2'],
    ref_2_6_3:'notification 4',
    notification5: '100',
    region:'United States',
    type: 'Chatbot',
    timeframe:10,
    price:8500,
    sofcopier:1,
    numusers:1,
    compliance:91,
    anitbribery:81,
    usecase:'Yes',
    personaldata:'No',
    insurance:['Not yet','Not yet','9900000'],

    complianceLabel:'golden',
    insuranceLevel:[false,false,true,false],
    membershipLabel:'premium',

    compareList:false

  },
  {
    id:6,
    name: 'Dera Capital Advisors',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
    details:'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
    supplier:'Ledaco',
    logoBig:'assets/img/logo_placeholder.png',
    ref_2_9:true,
    ref_2_9b:['Singapore'],
    ref_2_10:'notofication 2',
    ref_2_6_4: true,
    ref_2_6_5:['licence 1', 'licence 2'],
    ref_2_6_3:'notification 4',
    notification5: '100',
    region:'Singapore',
    type: 'Artificial Intelligence (AI)',
    timeframe:50,
    price:19500,
    sofcopier:50,
    numusers:15,
    compliance:72,
    anitbribery:81,
    usecase:'Yes',
    personaldata:'Yes',
    insurance:['Not yet','10000','3000'],

    complianceLabel:'silver',
    insuranceLevel:[false,true,true,false],
    membershipLabel:'core',

    compareList:false
  },
  {
    id:7,
    name: 'Dera Capital Advisors',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg',
    details:'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
    supplier:'Allied Controls',
    logoBig:'assets/img/logo-products/logo0.png',
    ref_2_9:true,
    ref_2_9b:['United States'],
    ref_2_10:'notofication 2',
    ref_2_6_4: true,
    ref_2_6_5:['licence 1', 'licence 2'],
    ref_2_6_3:'notification 4',
    notification5: '100',
    region:'United States',
    type: 'Robo-advisors',
    timeframe:90,
    price:10,
    sofcopier:30,
    numusers:10,
    compliance:84,
    anitbribery:78,
    usecase:'No',
    personaldata:'No',
    insurance:['20000','117000','100000'],

    complianceLabel:'silver',
    insuranceLevel:[true,true,true,true],
    membershipLabel:'core',

    compareList:false

  }
];
export const MocPocDataCountries:Country[] = [
    { name: 'USA',  selected: false, id: 1 },{ name: 'Hongkong',  selected: false, id:2 },
    { name: 'EU',  selected: false, id: 3 },{ name: 'Israel',  selected: false,id:4},
    { name: 'Great Britain',  selected: false, id: 5 },{ name:'Russia', selected: false, id:6},
    { name:'China', selected: false, id: 7 },{ name:'Argentina', selected: true,id:8},
    { name:'Brasil', selected: false, id: 9 },{ name:'Pakistan', selected: false,id:10},
    { name:'India', selected: false, id: 11 },{name:'Turkey',selected: true,id:12 },
    { name:'Philippines', selected: false, id: 13 },{name:'Egypt',selected: true,id:14 }
]
