const inquirer = require("inquirer");
var fs = require('fs')
const axios = require("axios");

class Employee {
    constructor(name, email, role, id) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.id = id;
        }
    }
class Manager extends Employee {
    constructor( name, email, id, officeNumber, gitHubUserName ){
        super( name, email, 'Manager', id );
        this.officeNumber = officeNumber;
        this.gitHubUserName = gitHubUserName;
            }};
    
class Engineer extends Employee {
    constructor( name, email, id, engineerGitHub ){
        super( name, email, 'Engineer', id );
        this.engineerGitHub = engineerGitHub;
            }};

class Intern extends Employee {
    constructor( name, email, id, school ){
        super( name, email, 'Intern', id );
        this.school = school;
            }};

async function main(){

    console.log(`starting`);
    var manager = '';
    var engineer ='';
    var intern = '';
    const userResponse = await inquirer
    .prompt([
        {
            type: "input",
            message: "What is your name?",
            name: "managerName"
        },
        {
            type: "input",
            message: "Provide your employee ID number. ",
            name: "managerID"
        },
        {
            type: "input",
            message: "What is your email address?",
            name: "managerEmail"
        },
        {
            type: "input",
            message: "What is your gitHub user name?",
            name: "managerGitHubUserName"
        },
        {
            type: "input",
            message: "What is your Office number?",
            name: "managerOfficeNumber"
        },
        {
            type: "input",
            message: "How many people is in your team?",
            name: "teamNumber"
        }
        ]);
        console.log(`starting`);
        console.log(`collected user response`);
        const managerName = userResponse.managerName;
        const managerGitHubUserName = userResponse.managerGitHubUserName;
        const managerID = userResponse.managerID;
        const managerOfficeNumber = userResponse.managerOfficeNumber;
        const managerEmail = userResponse.managerEmail;
        const teamNumber = Number(userResponse.teamNumber);

        const gitResponse = await axios.get(`https://api.github.com/users/${managerGitHubUserName}`);
        const gitData = gitResponse.data;
        const gitUrl = gitData.html_url;
        const gitProfileImage = gitData.avatar_url;

        const newManager = new Manager(managerName, managerEmail, managerID, managerOfficeNumber, managerGitHubUserName);
        // console.log('manager: ' + JSON.stringify(newManager));

        let tmpl_manager = fs.readFileSync('htmlTemplate/manager_template.html', 'utf-8');
        tmpl_manager = tmpl_manager.replace('%MANAGER-NAME%', newManager.name).replace('%MANAGER-EMAIL%', newManager.email).replace('%MANAGER-GIT%', newManager.gitHubUserName).replace('%MANAGER-OFFICENO%', newManager.officeNumber).replace('%MANAGER-ID%', newManager.id).replace('%MANG-GIT-IMG%', gitProfileImage).replace('%MANAGER-GIT-URL%', gitUrl);
        let writeEmployee = fs.writeFileSync('html/employee.html', '');
        
        console.log(`collected info from manager`);
        for (i=0; i<teamNumber; i++){
            const userResponse2 = await inquirer
            .prompt([
                {
                    type: "input",
                    message: `What is the name of the employee ${i+1}`,
                    name: "employeeName"
                },
                {
                    type: "input",
                    message: `What is the employees id no?`,
                    name: "employeeIdNo"
                },
                {
                    type: 'list',
                    name: 'typeOfEmployee',
                    message: 'select type of employee',
                    choices: ['engineer', 'intern']
                }
            ]);
            var employeeName = userResponse2.employeeName;
            var typeOfEmployee = userResponse2.typeOfEmployee;
            var employeeIdNo = userResponse2.employeeIdNo;
                if(typeOfEmployee == 'intern'){
                    const userResponse3 = await inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "What is the email of the Intern",
                                name: "internEmail"
                            },
                            {
                                type: "input",
                                message: "What is the School of the Intern",
                                name: "internSchool"
                            }
                        ]);
                        var internEmail = userResponse3.internEmail;
                        var internSchool = userResponse3.internSchool;

                        const newIntern = new Intern(employeeName, internEmail, employeeIdNo, internSchool);
                        console.log(`collected info from intern`+ newIntern.name);
                        console.log(newIntern.name);
                        let tmpl_intern = fs.readFileSync('htmlTemplate/intern_template.html', 'utf-8');
                        tmpl_intern = tmpl_intern.replace('%INTERN-NAME%', newIntern.name).replace('%INTERN-EMAIL%', newIntern.email).replace('%INTERN-SCHOOL%', newIntern.school).replace('%INTERN-IDNO%', newIntern.id);
                        let writeIntern = fs.appendFileSync('html/employee.html', tmpl_intern);
                    } else {
                        const userResponse4 = await inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "What is the email of the employee",
                                name: "engineerEmail"
                            },
                            {
                                type: "input",
                                message: "What is the Employee's GitHub User Name",
                                name: "engineerGitHub"
                            }
                        ]);
                        var engineerEmail = userResponse4.engineerEmail;
                        var engineerGitHub = userResponse4.engineerGitHub;
                        const gitResponse2 = await axios.get(`https://api.github.com/users/${engineerGitHub}`);
                        const gitData2 = gitResponse2.data;
                        const gitUrlEng = gitData2.html_url;
                        const gitProfileImageEng = gitData2.avatar_url;

                        console.log( employeeName + ` is an ` + typeOfEmployee + `. their email is: ` +  engineerEmail + ` and their gitHub user id is ` + engineerGitHub)

                        const newEngineer = new Engineer(employeeName, engineerEmail, employeeIdNo, engineerGitHub);
                        
                        let tmpl_engineer = fs.readFileSync('htmlTemplate/engineer_template.html', 'utf-8');
                        console.log(`collected info from engineer`+ newEngineer.name);
                        console.log(newEngineer.name);
                        tmpl_engineer = tmpl_engineer.replace('%ENGINEERS-NAME%', newEngineer.name).replace('%ENGINEER-EMAIL%', newEngineer.email).replace('%ENGINEER-GITHUB%',newEngineer.engineerGitHub).replace('%ENG-GIT-IMG%',gitProfileImageEng).replace('%ENGINEER-GIT-URL%',gitUrlEng).replace('%ENGINEER-IDNO%', newEngineer.id);
                        let writeEngineer = fs.appendFileSync('html/employee.html', tmpl_engineer);
                    }
                }
let employeefile = fs.readFileSync('html/employee.html', 'utf-8');
let mainHtml = fs.readFileSync('htmlTemplate/index_template.html', 'utf-8');
mainHtml = mainHtml.replace('%MANAGERSECTION%', tmpl_manager).replace('%OTHEREMPLOYEESECTION%', employeefile);
let writeHTML = fs.writeFileSync('index.html', '');
writeHTML = fs.writeFileSync('index.html', mainHtml);
    }
main();
