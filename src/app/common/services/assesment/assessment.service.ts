import { Injectable } from '@angular/core';

export interface IAssessmentsElement {
  id?: string;
  baseLevel?: string;
  title?: string;
  data?: any;
  icon?: string;
  // status: number;
  progress?: number;
  items?: Array<IAssessmentsElement>;
  components?: Array<IAssessmentsElement>;
  uploadingFile?: boolean;
  status?: string;
  validDate?: Date;
  hash?: string;
  questions?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor() { }

  public get informationSecurityAssesment(): any[] {
    return [
         {
            order: 1,
            title: 'Identify',
            questions: [
               {
                  id: 'I.1',
                  question: 'Please provide details how your Security Risk Assessment framework (maintaining Confidentially, Integrity and Availability). How risks are assessed and how this affects your Information Security posture and ultimately your Information Security Policy.',
                  guidance: 'There are many IT risk management methodologies available these include: ISO/IEC 27005, BS 7799-3:2017, NIST SP 800-39.\nYour framework or process must show how you Identify, Analyse, Evaluate, Respond and Monitor risks. Normally this will includes regular risk assessments and workshops to understand and mitigate issues.\nPotential product: Risk Assessment Framework, Process or Policy.',
                  templateName: '',
                  existingQuestion: 'Yes',
                  linkToTemplate: ''
               }
            ]
         },
         {
            order: 2,
            title: 'Protect',
            questions: [
               {
                  id: 'P.1',
                  question: 'Please upload your Information Security Policy.',
                  guidance: 'Your Information Security Policy is your high level policy that displays your commitment to Information Security and refers to subsequent policies.',
                  templateName: 'XX-SP-000001-Information_Security_Policy.docx',
                  existingQuestion: 'Yes',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Policies/XX-SP-000001-Information_Security_Policy.docx'
               },
               {
                  id: 'P.2',
                  question: 'Please provide details of how you keep Employees up to date with Information Security best practice and their responsibilities.',
                  guidance: 'This may be included in your: Employee Handbook, Information Security Awareness Programme, Joiners, Movers and Leavers Process. \nWhat is looked for is the programme that is in place when employees start, during their employment and at termination. Also the scope of the awareness programme and how this is communicated to employees and 3rd parties. Please provide a statements and reference the uploaded file.\nPotential documents: Employee Handbook, Information Security Awareness Programme, Joiners and Leavers Process.',
                  templateName: '',
                  existingQuestion: '',
                  linkToTemplate: ''
               },
               {
                  id: 'P.3',
                  question: 'Please provide details of your Asset Management Policy. How physical, virtual and information assets are introduced in to the system and how they are maintained.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.\nPotential Document: Asset Management Process.',
                  templateName: 'XX-PR-000005-Asset_Management_Procedure.docx',
                  existingQuestion: 'Yes',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Processes/XX-PR-000005-Asset_Management_Procedure.docx'
               },
               {
                  id: 'P.4',
                  question: 'Please provide your companies employee/3rd party screening process. This may be part of your pre-employment and/or joiners & leavers procedures.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.\nPotential Document: Background Screening Process.',
                  templateName: '',
                  existingQuestion: '',
                  linkToTemplate: ''
               },
               {
                  id: 'P.5',
                  question: 'Please evidence of how Technical designs are reviewed and kept up to date.',
                  guidance: 'Details of the change management around technical designs. You could include a screen shot of versions or the spreadsheet where you record changes and versions.',
                  templateName: '',
                  existingQuestion: '',
                  linkToTemplate: ''
               },
               {
                  id: 'P.6',
                  question: 'Please provide your company Cryptography Controls standard. This will include the mandated minimum cryptography standards used.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.\nPotential Document: Cryptography Control Standard.',
                  templateName: 'XX-SS-000002-Cryptographic_Controls_Standard.docx',
                  existingQuestion: '',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Standards/XX-SS-000002-Cryptographic_Controls_Standard.docx'
               },
               {
                  id: 'P.7',
                  question: 'Please provide details of your Data Classification and Information Handling Policy. How your company protects certain types of data for yourselves and how you ensure your 3rd parties do the same. This should include what is mandated for different types of data while at rest and in transit.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.\nPotential Document: Data Classification and Handling Policy.',
                  templateName: 'XX-SP-000019-Data_Classifcation_&_Handling_Policy.docx',
                  existingQuestion: 'Yes',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Policies/XX-SP-000019-Data_Classifcation_&_Handling_Policy.docx'
               },
               {
                  id: 'P.8',
                  question: 'Please provide assurances of the precautions taken to restrict traffic into your network through your perimeter firewalls for access externally in and between live, dev and test environments.',
                  guidance: 'This may include firewall rules and network diagrams however we understand these are very sensitive documents and you may wish to provide assurances in other ways. These might include a statement of your policy on how you allow traffic in and out and between environments. Also referencing current Penetration testing as evidence.',
                  templateName: '',
                  existingQuestion: '',
                  linkToTemplate: ''
               },
               {
                  id: 'P.9',
                  question: 'Please give details how privileged access is restricted within your company (local and remote systems). This should include how long privileged access is valid for and how this is reviewed.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.\nPotential Documents: Access Control Policy.',
                  templateName: 'XX-SP-000005-Access_Control_Policy.docx',
                  existingQuestion: '',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Policies/XX-SP-000005-Access_Control_Policy.docx'
               },
               {
                  id: 'P.10',
                  question: 'Please provide your Password and PIN requirements standard.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.\nPotential Document: Access Control Policy or Password & PIN Standard.',
                  templateName: 'XX-SS-000003-Password_&_PIN_Requirements_Standard.docx',
                  existingQuestion: '',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Standards/XX-SS-000003-Password_&_PIN_Requirements_Standard.docx'
               },
               {
                  id: 'P.11',
                  question: 'Please provide your Remote Access Policy.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.',
                  templateName: '',
                  existingQuestion: '',
                  linkToTemplate: ''
               },
               {
                  id: 'P.12',
                  question: 'Please provide detail of your Removable Media Policy.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.\nPotential document: Removable Media Policy or Standard.',
                  templateName: 'XX-SS-000004-AntiVirus_&_Proxy_Standard.docx',
                  existingQuestion: '',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Standards/XX-SS-000004-AntiVirus_&_Proxy_Standard.docx'
               },
               {
                  id: 'P.13',
                  question: 'Please provide detail of your Bring Your Own Device Policy.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.',
                  templateName: 'XX-SP-000020-BYOD_Policy.docx',
                  existingQuestion: '',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Policies/XX-SP-000020-BYOD_Policy.docx'
               },
               {
                  id: 'P.14',
                  question: 'Please provide your User Control Management process. This should provide details of how users are authorised to gain access to data assets and how internal and 3rd party users are mapped to those specific resources. It should also include how access rights and roles are defined to provide granular access and how this relates to your retention policy. In addition confirming digital identities are unique , clearly identifiable and not re-used.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.\nPotential documents: Access Control Policy or User Control Management Process.',
                  templateName: 'XX-SP-000005-Access_Control_Policy.docx',
                  existingQuestion: '',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Policies/XX-SP-000005-Access_Control_Policy.docx'
               },
               {
                  id: 'P.15',
                  question: 'Please provide details of your patch management standard including how systems are configured to receive patches, how they are tested , the schedule for updating and monitoring in place.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.\nPotential documents: Patch Management Standard.',
                  templateName: 'XX-SS-000001-Patch_Management_Standard.docx',
                  existingQuestion: '',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Standards/XX-SS-000001-Patch_Management_Standard.docx'
               },
               {
                  id: 'P.16',
                  question: 'Please confirm the Antivirus/Malware controls enabled for your business.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.\nPotential document: Anti-Virus and Proxy Standard.',
                  templateName: 'XX-SS-000004-AntiVirus_&_Proxy_Standard.docx',
                  existingQuestion: '',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Standards/XX-SS-000004-AntiVirus_&_Proxy_Standard.docx'
               },
               {
                  id: 'P.17',
                  question: 'Please provide details of how direct Internet access is restricted for ALL systems. This might be via traditional proxy servers or within AV products.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.\nPotential document: Anti-Virus and Proxy Standard.',
                  templateName: 'XX-SS-000004-AntiVirus_&_Proxy_Standard.docx',
                  existingQuestion: '',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Standards/XX-SS-000004-AntiVirus_&_Proxy_Standard.docx'
               },
               {
                  id: 'P.18',
                  question: 'Please provide details of how your company restricts Internet Access to protect equipment and staff from malicious and undesirable sites.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.',
                  templateName: 'XX-SS-000004-AntiVirus_&_Proxy_Standard.docx',
                  existingQuestion: '',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Standards/XX-SS-000004-AntiVirus_&_Proxy_Standard.docx'
               },
               {
                  id: 'P.19',
                  question: 'Please explain how you evaluate the risk posed by your 3rd parties. This may be via a security questionnaire or security checklist completed by the 3rd party.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.\nPotential document: 3rd party security questionnaire.',
                  templateName: 'Supplier_Security_Questionnaire.docx',
                  existingQuestion: '',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Questionnaire/Supplier_Security_Questionnaire.docx'
               },
               {
                  id: 'P.20',
                  question: 'Please provide details of the contractual requirements and procedures in place with your 3rd parties to deal with security incidents and data breaches.',
                  guidance: 'Please provide a statement or the page, section and Paragraph location of the detail in the uploaded file.\nPotential document: 3rd Party Contract Template.',
                  templateName: '',
                  existingQuestion: '',
                  linkToTemplate: ''
               },
               {
                  id: 'P.21',
                  question: 'Please provide your Software Development Life Cycle documentation.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.',
                  templateName: '',
                  existingQuestion: '',
                  linkToTemplate: ''
               },
               {
                  id: 'P.22',
                  question: 'Please provide details of how security principles are included within the development of solutions.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible. This may include the understanding and removal of the OWASP top 10 vulnerabilities and ongoing vulnerability testing during development.',
                  templateName: '',
                  existingQuestion: '',
                  linkToTemplate: ''
               },
               {
                  id: 'P.23',
                  question: 'Please provide details of your backup policy.',
                  guidance: 'Please upload your Backup policy or upload the file this information is held in and provide references to it.',
                  templateName: 'XX-SP-000008-Operations_Security_Policy.docx',
                  existingQuestion: '',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Policies/XX-SP-000008-Operations_Security_Policy.docx'
               },
               {
                  id: 'P.24',
                  question: 'Please describe how do you comply with GDPR. Including your nominated officer and any external consultants and auditors used.',
                  guidance: 'Please provide a statement.',
                  templateName: '',
                  existingQuestion: '',
                  linkToTemplate: ''
               },
               {
                  id: 'P.25',
                  question: 'Please provide details of your Physical Threat Assessments conducted on your offices and data centres. This will include but is not limited to: 24x7 security, CCTV, Access Control solutions in place, locked caged areas, granular access levels configured.',
                  guidance: 'Description of threat assessment and/or the actual reports uploaded.',
                  templateName: '',
                  existingQuestion: '',
                  linkToTemplate: ''
               }
            ]
         },
         {
            order: 3,
            title: 'Detect',
            questions: [
               {
                  id: 'D.1',
                  question: 'Please provide details of your Vulnerability Testing process including the scope and frequency of testing.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.\nPotential document: Vulnerability Testing Process or Standard.',
                  templateName: 'XX-PR-000006-Vulnerability_Management_Procedure.docx',
                  existingQuestion: 'Yes',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Processes/XX-PR-000006-Vulnerability_Management_Procedure.docx'
               },
               {
                  id: 'D.2',
                  question: 'How do you monitor for and identify security events and what processes are in place to respond to these?',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.\nPotential document: Security Monitoring Standard/Policy.',
                  templateName: 'XX-SP-000008-Operations_Security_Policy.docx',
                  existingQuestion: '',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Policies/XX-SP-000008-Operations_Security_Policy.docx'
               },
               {
                  id: 'D.3',
                  question: 'Please provide details of how you manage and control the installation of software within your organisation including how you scan for unlicensed software.',
                  guidance: 'Please provide a statement and/or details of Page, Section and Paragraph location of the detail in the uploaded file.\nPotential document: Logging & Monitoring standard.',
                  templateName: 'XX-SP-000008-Operations_Security_Policy.docx',
                  existingQuestion: '',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Policies/XX-SP-000008-Operations_Security_Policy.docx'
               },
               {
                  id: 'D.4',
                  question: 'Please provide details of the IDS/IPS system you have in place.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.',
                  templateName: '',
                  existingQuestion: '',
                  linkToTemplate: ''
               },
               {
                  id: 'D.5',
                  question: 'Please describe what DDoS mitigation precautions you have in place.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.',
                  templateName: '',
                  existingQuestion: '',
                  linkToTemplate: ''
               }
            ]
         },
         {
            order: 4,
            title: 'Response',
            questions: [
               {
                  id: 'R.1',
                  question: 'Please provide details of your Incident Management Process.',
                  guidance: 'Please provide a statement, the specific file and the page, section and paragraph location of the detail if possible.',
                  templateName: 'XX-PR-000003-Security_Incident_Management_Procedure.docx',
                  existingQuestion: 'Yes',
                  linkToTemplate: 'https://techpassport-my.sharepoint.com/personal/dave_techpassport_io/Documents/SharedWithPiotr/GenericDocs-Complete/Processes/XX-PR-000003-Security_Incident_Management_Procedure.docx'
               }
            ]
         },
         {
            order: 5,
            title: 'Recovery',
            questions: [

            ]
         }
      ];
  }

  public get assessments(): Array<IAssessmentsElement> {
    return [
      { // 1  Information Security
        title: 'Information Security',
        id: 'informationSecurity',
        baseLevel: 'supplier',
        icon: 'security',
        status: 'none',
        progress: 0,
        items: [ ]
      },
      { // 2  Cyber Security
        title: 'Cyber Security',
        id: 'cyberSecurity',
        baseLevel: 'supplier',
        icon: 'wifi_lock',
        status: 'none',
        progress: 0,
        items: [
          {
            title: 'Procedures',
            items: [
              {
                title: 'Data Centres - SSAE 16',
                components: [
                  {id: 'SSAE16'}
                ]
              }
            ]
          },
          {
            title: 'Certifications',
            items: [
              {
                title: 'Previous Pen Testing Reports',
                components: [
                  {id: 'penTestingReports', validDate: null}
                ]
              },
              {
                title: 'Current Pen Testing Reports',
                components: [
                  {id: 'penTestingReportsCurrent', validDate: null}
                ]
              },
              {
                title: 'SSAE18 SOC2',
                components: [
                  {id: 'SSAE18', validDate: null}
                ]
              },
              {
                title: 'ISO27001',
                components: [
                  {id: 'ISO27001', validDate: null}
                ]
              },
              {
                title: 'NIST800-53r4',
                components: [
                  {id: 'NIST800', validDate: null}
                ]
              },
              {
                title: 'PCI-DSS',
                components: [
                  {id: 'PCI', validDate: null}
                ]
              },
              {
                title: 'cyberEssentials',
                components: [
                  {id: 'cyberEssentials', validDate: null}
                ]
              },
              {
                title: 'cyberEssentialsPlus',
                components: [
                  {id: 'cyberEssentialsPlus', validDate: null}
                ]
              },
              {
                title: 'CPMI-IOSCO guidance on cyber security',
                components: [
                  {id: 'CPMI', validDate: null}
                ]
              }
            ]
          }
        ]
      },
      { // 3  Records Management
        title: 'Records Management',
        id: 'Records Management',
        baseLevel: 'supplier',
        icon: 'library_books',
        status: 'none',
        progress: 0,
        items: [
          {
            title: 'Procedures',
            items: [
              {
                title: 'Records Type Schedule',
                components: [
                  {id: 'recordsTypeSchedule'}
                ]
              },
              {
                title: 'Creation and Retreival process',
                components: [
                  {id: 'creationProcess'}
                ]
              },
              {
                title: 'Retention and Disposal process',
                components: [
                  {id: 'retentionProcess'}
                ]
              },
              {
                title: 'Data destruction process',
                components: [
                  {id: 'dataDestructionProcess'}
                ]
              }
            ]
          }
        ]
      },
      { // 4  Business Continuity
        title: 'Business Continuity',
        id: 'businessContinuity',
        baseLevel: 'supplier',
        icon: 'shop_two',
        status: 'none',
        progress: 0,
        items: [
          {
            title: 'Procedures',
            items: [
              {
                title: 'Business continuity process',
                components: [
                  { id: 'continuityProcess'}
                ]
              },
              {
                title: 'Sample disaster recovery documentation',
                components: [
                  { id: 'continuityDisasterRecovery' }
                ]
              }
            ]
          }
        ]
      },
      { // 5 Anti-Bribery
        id: 'anti-bribery',
        title: 'Anti-Bribery',
        baseLevel: 'supplier',
        icon: 'thumbs_up_down',
        status: 'none',
        progress: 0,
        items: [
          {
            title: 'Procedures',
            items: [
              {
                title: 'Anti Bribery Reporting',
                components: [
                  {id: 'threatAndRisk', title: 'Threat and Risk Assessments'},
                  {id: 'diligenceReport', title: 'Risk Based Anti Bribary Due Diligence Report'},
                  {id: 'proceduresAndProcesses', title: 'Ongoing Assessment of procedures and processes'},
                  {id: 'registerAndAssessment', title: 'Gifts and Entertainment Register and Assessment and escalation'},
                  {id: 'politicalDonations', title: 'Charitable and political donations'},
                  {id: 'facilitationPayments', title: 'Facilitation Payments'},
                  {id: 'thirdParties', title: 'High Risk Third Parties'}
                ]
              }
            ]

          },
          {
            title: 'Training',
            items: [
              {
                title: 'Anti Bribery Training for all staff',
                components: [{id: 'training'}]
              }
            ],

          }
        ]
      },
      { // 6 Sanctions
        title: 'Sanctions',
        id: 'sanctions',
        baseLevel: 'supplier',
        icon: 'signal_cellular_no_sim',
        status: 'none',
        progress: 0,
        items: [
          {
            title: 'Policies',
            items: [
              {
                title: 'Sanctions Policy or statement',
                components: [
                  {id: 'sanctions'}
                ]
              }
            ]
          },
          {
            title: 'Procedures',
            items: [
              {
                title: 'Contingent Worker/Contractor/Consultants Screening',
                components: [
                  {id: 'screening'}
                ]
              }
            ]
          }
        ]
      },
      { // 7 Anti-Money Laundering
        title: 'Anti-Money Laundering',
        id: 'antiMoneyLaundering',
        baseLevel: 'supplier',
        icon: 'money_off',
        status: 'none',
        progress: 0,
        items: [
          {
            title: 'Training',
            items: [
              {
                title: 'Anti-Money Laundering & Counter Terrorist Financing Training',
                components: [
                  {id: 'antiMoneyTraining'}
                ]
              }
            ]
          },
          {
            title: 'Procedures',
            items: [
              {
                title: 'Customer Due Diligence (CDD) including Enhanced Customer Due Diligence (EDD)',
                components: [
                  {id: 'antiMoneyTrainingProcedureDiligence'}
                ]
              },
              {
                title: 'Ongoing Customer Due Diligence (ODD)- sample reporting',
                components: [
                  {id: 'antiMoneyTrainingProcedureSample'}
                ]
              },
              {
                title: 'Politically Exposed Person Identification process',
                components: [
                  {id: 'antiMoneyTrainingProcedureIdentification'}
                ]
              },
              {
                title: 'SAR (Suspicious Actvity Reporting)',
                components: [
                  {id: 'antiMoneyTrainingProcedureSAR'}
                ]
              },
              {
                title: 'Code of Supplier Responsibility, or a similar policy or statement',
                components: [
                  {id: 'antiMoneyTrainingProcedureResponsibility'}
                ]
              }
            ]
          }


        ]
      },
      { // 8 Remuneration
        title: 'Remuneration',
        id: 'remuneration',
        baseLevel: 'supplier',
        icon: 'local_atm',
        status: 'none',
        progress: 0,
        items: [
          {
            title: 'Procedures',
            items: [
              {
                title: 'Remuneration annual review',
                components: [
                  {id: 'bonusPlan', title: 'Bonus Plan'},
                  {id: 'incentivePlan', title: 'Commission/Incentive Plan'},
                  {id: 'recognitionPlan', title: 'Recognition Plan'},
                  {id: 'salaryAdjustmentPlan', title: 'Salary Adjustment Plan'}

                ]
              }
            ]

          }
        ]
      },
      { // 9  Supply Chain
        title: 'Supply Chain',
        id: 'supplyChain',
        baseLevel: 'supplier',
        icon: 'share',
        status: 'none',
        progress: 0,
        items: [
          {
            title: 'Policies',
            items: [
              {
                title: 'Payments Policy',
                components: [
                  {id: 'paymentsPolicy'}
                ]
              }
            ]
          },
          {
            title: 'Procedures',
            items: [
              {
                title: 'Supply Chain management approach',
                components: [
                  {id: 'supplyChain'}
                ]
              },
              {
                title: 'Ethical and sustainable practices with supply chain and risk approach to ensuring',
                components: [
                  {id: 'ethicalAndSustainable'}
                ]
              },
              {
                title: 'Responsible business strategy',
                components: [
                  {id: 'responsibleBusinessStrategy'}
                ]
              },
              {
                title: 'Code of Supplier Responsibility, or a similar policy or statement',
                components: [
                  {id: 'codeOfSupplierResponsibility'}
                ]
              }

            ]
          }
        ]
      },
      { // 10   Health & Safety
        title: 'Health & Safety',
        id: 'healthSafety',
        baseLevel: 'supplier',
        icon: 'beenhere',
        status: 'none',
        progress: 0,
        items: [
          {
            title: 'Procedures',
            items: [
              {
                title: 'In-house documented safety management system',
                components: [
                  { id: 'inHouseDocumented' }
                ]
              },
              {
                title: 'Resource and Structure to manage Health and Safety - in accordance with Health and Safety Regulations 1999',
                components: [
                  {id: 'manageHealthSafety'}
                ]
              },
              {
                title: 'Health and Safety Policy (note – Only required for suppliers with 5 or more employees). Specific/measurable targets and actions. External reporting of accidents/incidents Names a senior manager/board member responsible for H&S.',
                components: [
                  { id: 'healthSafetyPolicy' }
                ]
              }

            ]
          },
          {
            title: 'Training',
            items: [
              {
                title: 'Regular Health and Safety Training for all employees',
                components: [
                  { id: 'healthSafetyPolicy' }
                ]
              }
            ]
          }

        ]
      },
      { // 11  Whistleblowing
        title: 'Whistleblowing',
        id: 'whistleblowing',
        baseLevel: 'supplier',
        icon: 'assignment_late',
        status: 'none',
        progress: 0,
        items: [
          {
            title: 'Procedures',
            items: [
              {
                title: 'Whistle blowing policy',
                components: [
                  {id: 'whistleBlowingPolicy'}
                ]
              }
            ]
          },
          {
            title: 'Certifications',
            items: [
              {
                title: 'Whistle blowing training',
                components: [
                  {id: 'whistleBlowingPolicy', validDate: null}
                ]
              }
            ]
          }
        ]
      }

   ];
  }
  public get assessmentTotal(): number {
    let total = 0;
    for (const item of this.assessments) {
      for (const level1 of item.items) {
        for (const level2 of level1.items) {
          total += level2.components.length;
        }
      }
      // this.assesmentsTotalPerProduct
    }
    return total;
  }

  public get assessmentLevelTotal(): Array<any> {
    const total = [];
    for (const item of this.assessments) {
      const level = { title: item.title, total: 0 };
      for (const level1 of item.items) {
        for (const level2 of level1.items) {
          level.total += level2.components.length;
          for (const component of level2.components) {
            if (component.hasOwnProperty('validDate')) {
                level.total++;
            }
          }
        }
      }
      total.push( level );
    }
    return total;
  }

  public get questionsTotal(): number {
    let total = 0;
    for (const item of this.informationSecurityAssesment) {
      total += item.questions.length;
    }
    return total;
  }
}
