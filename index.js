const inquirer = require("inquirer");
var fs = require('fs')

var cheerio = require('cheerio');
const path = require('path');
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
        console.log(userResponse);
        const managerName = userResponse.managerName;
        const managerGitHubUserName = userResponse.managerGitHubUserName;
        const managerID = userResponse.managerID;
        const managerOfficeNumber = userResponse.managerOfficeNumber;
        const managerEmail = userResponse.managerEmail;
        const teamNumber = Number(userResponse.teamNumber);
        const newManager = new Manager(managerName, managerEmail, managerID, managerOfficeNumber, managerGitHubUserName);
        console.log(newManager)
        //Manager {name: "sara", email: "sara@gmail.com", role: "Manager", officeNumber: 3214, gitHubUserName: "SaraMunir"}

        var employeeInfo = '';
        var employeeName = '';
        var typeOfEmployee = '';
        var internEmail = '';
        var internSchool = '';
        var engineerEmail = '';
        var engineerGitHub = '';
        var internInfo = '';
        var engineerInfo = '';
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

                        console.log( employeeName + ` is an ` + typeOfEmployee + `. their email is:` +  internEmail + `. Studied at  ` + internSchool)
                        const newIntern = new Intern(employeeName, internEmail, employeeIdNo, internSchool);
                        var interns = JSON.stringify(newIntern);
                        fs.appendFile(path.join(__dirname, '/jsfiles', 'intern.json'), interns, function(err){
                            if(err) throw err;
                            console.log('file written to...');
                        })
                        console.log(newIntern)
                        var internInfo = internInfo +  (`
                        <div>
                        <h2>${typeOfEmployee}</h2>
                        <h3>${internEmail}</h3>
                        <h2>${employeeName}</h2>
                        <h4>${internSchool}</h4>
                        </div>
                        `);
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
                        console.log( employeeName + ` is an ` + typeOfEmployee + `. their email is: ` +  engineerEmail + ` and their gitHub user id is ` + engineerGitHub)
                        const newEngineer = new Engineer(employeeName, engineerEmail, employeeIdNo, engineerGitHub);
                        console.log(newEngineer)
                        var engineerInfo = engineerInfo +  (`<div><h2>${typeOfEmployee}</h2><h3>email: ${engineerEmail}</h3><h2>${employeeName}</h2><h4>Git hub url: ${engineerGitHub}</h4></div>`);
                    } 
                }
            // fetching data from git
            // user
            var manager = (`
            <h2>${managerName}</h2>
            <h3>${managerGitHubUserName}</h3>
            <a href="${managerEmail}"></a>
            `)
        var result = manager + engineerInfo + internInfo;
var writeResult = fs.writeFileSync(path.join(__dirname, '../TeamGenerator', 'result.html'), result )
console.log("file generated....")
    }
main();
