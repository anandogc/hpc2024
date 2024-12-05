const components = {
    "Name": {
        view: function(self) {
            return `<span id="name" class="dib mr2 pa2">
                `+self.data.name+`
            </span>`        
        }
    },
    "InstituteProfile": {
        view: function() {
            return `
                <section class="ba ma3 br2 br--bottom overflow-hidden" data-source="user/profile" data-component="InstituteProfile">

                    <header class="bg-color1 color2 pa2">Institute Profile</header>
                    <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                        <tbody>
                            <tr class="striped--light-gray">
                                <td class="pv1 ph3 w-20">Name:</td>
                                <td>`+self.data["Name"]+`</td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv1 ph3">Department:</td>
                                <td>`+self.data["Department"].toUpperCase()+`</td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv1 ph3">Roll/PF No.:</td>
                                <td>`+self.data["ID_no"]+`</td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv1 ph3">Username:</td>
                                <td>`+self.data["Username"]+`</td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv1 ph3">Designation:</td>
                                <td>`+self.data["Designation"]+`</td>
                            </tr>
                        </tbody>
                    </table>
                </section>`
        }
    },

    "Statistics": {
        account: function(data) {
            return `
                <section class="ba ma3 br2 br--bottom overflow-hidden">
                        <header class="bg-color1 color2 pa2">
                            `+data["Title"]+`
                        </header>
                        <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                            <tbody>
                                <tr class="striped--light-gray bb b--black">
                                    <td class="pv2 ph3">Parameter</td>
                                    <td class="pv2 ph5 tr">Used</td>
                                    <td class="pv2 ph5 tr">Remaining</td>
                                    <td class="pv2 ph5 tr">Total</td>

                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">Balance</td>
                                    <td class="pv2 ph5 tr">₹`+data["Balance"][0]+`</td>
                                    <td class="pv2 ph5 tr">₹`+data["Balance"][1]+`</td>
                                    <td class="pv2 ph5 tr">₹`+data["Balance"][2]+`</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">CPU core hours</td>
                                    <td class="pv2 ph5 tr">`+data["CPU"][0]+`</td>
                                    <td class="pv2 ph5 tr">`+data["CPU"][1]+`</td>
                                    <td class="pv2 ph5 tr">`+data["CPU"][2]+`</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">GPU core hours</td>
                                    <td class="pv2 ph5 tr">`+data["GPU"][0]+`</td>
                                    <td class="pv2 ph5 tr">`+data["GPU"][1]+`</td>
                                    <td class="pv2 ph5 tr">`+data["GPU"][2]+`</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">Home Space</td>
                                    <td class="pv2 ph5 tr">`+data["Home"][0]+` GB</td>
                                    <td class="pv2 ph5 tr">`+data["Home"][1]+` GB</td>
                                    <td class="pv2 ph5 tr">`+data["Home"][2]+` GB</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">Scratch Space</td>
                                    <td class="pv2 ph5 tr">`+data["Scratch"][0]+` GB</td>
                                    <td class="pv2 ph5 tr">`+data["Scratch"][1]+` GB</td>
                                    <td class="pv2 ph5 tr">`+data["Scratch"][2]+` GB</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3" colspan="4">Alert Message: None</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>`
        },
        view: function() {
            return `
            <div>
                <p class="mh3 mt2 mb0">Notes:</p>
                <ol class="mt1 mh3">
                    <li>Param Sanganak High Priority Access and Regular Access have common Storage.</li>
                    <li>These values show the status as on `+self.data["Updated_on"]+` (Updated daily).</li>
                    <li>For checking current values, please use these "commands" on the cluster.</li>
                </ol>
                `
                +self.account(self.data["Accounts"][0])
                +self.account(self.data["Accounts"][1])
                +self.account(self.data["Accounts"][2])
                
            +`</div>`
        }
    },

    "Projects": {
        view: function() {
            let section = `
                <section class="ba mh3 mt3 br2 br--bottom overflow-hidden"
                    data-source="user/project"
                    data-component="Projects">
                        <header class="bg-color1 color2 pa2 flex">
                            <div class="w-30 mr1">Project No.</div>
                            <div class="w-50 mh1">Title</div>
                            <div class="w-10 mh1">Start Date</div>
                            <div class="w-10 mh1">End Date</div>
                        </header>`
            let list = ``;
            self.data.list.forEach(function(d) {
                list += `  
                    <div class="pa2 flex striped--light-gray">
                        <div class="w-30 mr1">` + d.project_name + `</div>
                        <div class="w-50 overflow-hidden nowrap mh1">` + d.project_title + `</div>
                        <div class="w-10 mh1">` + d.start_date + `</div>
                        <div class="w-10 mh1">` + d.end_date + `</div>
                    </div>
                    `
            })
            if (self.data.list.length == 0) {
                list = `<div class="pa1">No available projects in our records.</div>`
            }
            
            section += list + `
                </section>`

            let project_list = ``;
            self.data.list.forEach(function(d) {
                project_list += `<option value="` + d.project_name + `">`
            })

            let budget_head = ``;
            ["CONT", "CONS"].forEach(function(d) {
                budget_head += `<option value="` + d + `">`
            })
            
              
            return `
                <div>
                    ` + section + `
                    <datalist id="project_list">
                        ` + project_list + `
                    </datalist>
                    <datalist id="project_list_for_group">
                    ` + project_list + `
                    </datalist>
                    <datalist id="budget_head">
                        ` + budget_head + `
                    </datalist>
                </div>`
        }   
    },

    "HPCProfile": {
        view: function() {
            if (self.data) {
                return `
                <section class="ba ma3 br2 br--bottom" data-source="user/hpc_profile" data-component="HPCProfile">
                    <header class="bg-color1 color2 pa2 flex justify-between">HPC Profile</header>
                    <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                        <tbody>
                            <tr class="striped--light-gray"><td class="pv1 ph3 w-20">Research Title:</td><td class="pa1">`+self.data["Research_Title"]+`</td></tr>
                            <tr class="striped--light-gray"><td class="pv1 ph3">Domain:</td><td class="pa1">`+self.data["Domain"]+`</td></tr>
                            <tr class="striped--light-gray"><td class="pv1 ph3">Sub-Domain:</td><td class="pa1">`+self.data["Sub-Domain"]+`</td></tr>
                            <tr class="striped--light-gray"><td class="pv1 ph3">Software:</td><td class="pa1">`+self.data["Software"]+`</td></tr>
                            <tr class="striped--light-gray"><td class="pv1 ph3">Contact-no:</td><td class="pa1">`+self.data["Contact"]+`</td></tr>
                            <tr class="striped--light-gray"><td class="pv1 ph3">Gender:</td><td class="pa1">`+self.data["Gender"]+`</td></tr>
                            `+ ((portal==='User') ? `<tr class="striped--light-gray"><td class="pv1 ph3">PI Name:</td><td class="pa1">`+self.data["PI"]+`</td>` : ``)+ `</tr>
                        </tbody>
                    </table>
                </section>`
            }
            else {
                return `
                <form id="hpc_profile" class="ba ma3 br2 br--bottom" data-source="user/hpc_profile" data-action="user/hpc_profile" data-component="HPCProfile" data-reload="application_details">
                    <header class="bg-color1 color2 pa2 flex justify-between">HPC Profile</header>
                    <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                        <tbody>
                            <tr class="striped--light-gray">
                                <td class="pv1 ph3 w-20">Research Title*:</td>
                                <td class="pa1">
                                    <input name="Research_Title" type="text" class="ma1 pa1 w-90 ba bg-white-40 br2 color1" required/>
                                </td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv1 ph3">Domain*:</td>
                                <td class="pa1">
                                    <div class="tag-container ma1 pa1 w-90 ba bg-white-40 br2 color1" id="domain-container">
                                        <input list="domain_list" id="domain-input" placeholder="Select or type..." class="bg-white-40 br2 color1">
                                        <input id="domain" type="hidden" name="Domain" required>                                        </td>
                                    </div>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv1 ph3">Sub-Domain*:</td>
                                <td class="pa1">
                                    <input name="Sub-Domain" type="text" class="ma1 pa1 w-90 ba bg-white-40 br2 color1" required/>
                                </td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv1 ph3">Software*:</td>
                                <td class="pa1">
                                    <div class="tag-container ma1 pa1 w-90 ba bg-white-40 br2 color1" id="software-container">
                                        <input list="application_list" id="software-input" placeholder="Select or type..." class="bg-white-40 br2 color1">
                                        <input name="Software" id="softwares" type="hidden" required>
                                    </div>
                                </td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv1 ph3">Contact-no*:</td>
                                <td class="pa1">
                                    <input name="Contact" type="text" class="ma1 pa1 w-90 ba bg-white-40 br2 color1" required/>
                                </td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv1 ph3">Gender*:</td>
                                <td class="pa1">
                                    <select name="Gender" class="ma1 pa1 ba bg-white-40 br2 color1">
                                        <option value="-">-----</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="T">Transgender</option>
                                    </select>
                                </td>
                            </tr>
                            `+ ( (portal==='User') ?
                            `<tr class="striped--light-gray">
                                <td class="pv1 ph3">PI Email*:</td>
                                <td class="pa1">
                                    <input name="pi_username" type="text" class="ma1 pa1 w5 ba bg-white-40 br2 color1" required/>@iitk.ac.in
                                </td>
                            </tr>`: ``) +
                            `<tr class="striped--light-gray">
                                <td class="pv1 ph3 tc" colspan="2">
                                    <input type="submit" value="Save"/>
                                </td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv1 ph3" colspan="2">*: Required fields</td>
                            </tr>
                        </tbody>
                    </table>
                </form>`
            }
        },
        "onupdate": function() {
            initializeTagInput('domain-container', 'domain-input', 'domain')
            initializeTagInput('software-container', 'software-input', 'softwares')
        }
    },

    "Report": {
        view: function() {
            return `
            <form id="report" class="ba ma3 br2 br--bottom overflow-hidden" data-source="user/report" data-action="user/report" data-component="Report">
                <header class="bg-color1 color2 pa2 flex justify-between">Annual Report</header>
                <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                    <tbody>
                        <tr class="striped--light-gray">
                            <td class="pa1 ph3">View:</td>
                            <td>`+ (self.data['report_file'] ? '<a class="dark-gray" href="user/view_report" downoload>Download Report</a>' : 'None') + `</td>
                            
                            <td class="pa1 bl">Template file:</td>
                            <td><a class="dark-gray" href="https://www.hpc.iitk.ac.in/paramsanganak/Work-Report.docx">Work-Report.docx</a></td>
                        </tr>
                        <tr class="striped--light-gray">
                            <td class="pa1 ph3">Submitted on:</td>
                            <td>`+ (self.data['submitted_on'] ? self.data['submitted_on'] : 'None') +`</td>
                            
                            <td class="pa1 bl">Upload:</td>
                            <td>
                                <input class="ma2 ba bg-white-40 br2 color1" type="file" name="work_report" accept=".docx">
                                <input class="ma2 ba bg-white-40 br2 color1" type="submit" value="Save"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>`
        }
    },
    "Charges": {
        view: function() {
            return `
                <table class="collapse center">
                    <tbody>
                        <tr>
                            <td class="pv2 ph3 tc b" colspan="2">Charges</td>
                        </tr>
                        <tr>
                            <td class="pv2 ph3">CPU core hours:</td>
                            <td class="pv2 ph3">₹`+self.data["cpu_per_core_hour"]+` per core hour</td>
                        </tr>
                        <tr>
                            <td class="pv2 ph3">GPU node hours:</td>
                            <td class="pv2 ph3">₹`+self.data["gpu_per_node_hour"]+` per node hour</td>
                        </tr>
                    </tbody>
                </table>`
        }
    },
   "Charges-RA": {
        view: function() {
            return `
                <table class="collapse center">
                    <tbody>
                        <tr>
                            <td class="pv2 ph3 tc b" colspan="2">Charges</td>
                        </tr>
                        <tr>
                            <td class="pv2 ph3">CPU core hours:</td>
                            <td class="pv2 ph3">₹`+self.data["cpu_per_core_hour"]+` per core hour</td>
                        </tr>
                        <tr>
                            <td class="pv2 ph3">GPU node hours:</td>
                            <td class="pv2 ph3">₹`+self.data["gpu_per_node_hour"]+` per node hour</td>
                        </tr>
                        <!-- <tr>
                            <td class="pv2 ph3">Last year's CPU core hours:</td>
                            <td class="pv2 ph3">`+Number(self.data["last_core_hour"]).toLocaleString('en-IN')+`</td>
                        </tr> -->

                    </tbody>
                </table>`
        }
    },

    "Charges-QA": {
        view: function() {
            return `
                <table class="collapse center">
                    <tbody>
                        <tr>
                            <td class="pv2 ph3 tc b" colspan="2">Charges</td>
                        </tr>
                        <tr>
                            <td class="pv2 ph3">Amount per quarter:</td>
                            <td class="pv2 ph3">₹`+self.data["rate"]+`</td>
                        </tr>
                    </tbody>
                </table>`
        }
    },
    "Application-HP": {
        stage: function(data) {
            if (data.admin_time) {
                return `Active`
            }
            // else if (data.rnd_time) {
            //     return `Admin Approval`
            // }
            else if (data.pi_time) {
                return `Admin Approval`
            }
            else {
                return `PI Approval`
            }
        },
        application: function(self) {
            if ("Application" in self.data) {

                return `
                <section class="ba ma3 br2 br--bottom">
                        <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                        <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                            <tbody>
                                <tr class="striped--light-gray">
                                    <td class="pv2 w-30 ph3">Application Id</td>
                                    <td class="pv2 w-20 ph3">`+self.data["Application"]["application_id"]+`</td>

                                    <td class="pv2 w-30 ph3 bl">Request Date</td>
                                    <td class="pv2 w-20 ph3">`+self.data["Application"]["request_at"]+`</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 w-30 ph3">Pool Allocation</td>
                                    <td class="pv2 w-20 ph3">`+(self.data["Application"]["pool_allocation"] ? '✔' : '✖')+`</td>

                                    <td class="pv2 w-30 ph3 bl">CPU core hours</td>
                                    <td class="pv2 w-20 ph3">`+Number(self.data["Application"]["cpu_core_hour"]).toLocaleString("en-IN")+`</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">Payment Mode</td>
                                    <td class="pv2 ph3">Project</td>

                                    <td class="pv2 ph3 bl">GPU node hours</td>
                                    <td class="pv2 ph3">`+Number(self.data["Application"]["gpu_node_hour"]).toLocaleString("en-IN")+`</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">Stage</td>
                                    <td class="pv2 ph3">`+self.stage(self.data["Application"])+`</td>

                                    <td class="pv2 ph3 bl">Amount</td>
                                    <td class="pv2 ph3">₹`+Number(self.data["Application"]["amount"]).toLocaleString("en-IN")+`</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>`
            }
            else {
                default_amount = self.data["AccountType"]["default_cpu_core_hours"]*self.data['Rates']['cpu_per_core_hour'] + self.data["AccountType"]["default_gpu_node_hours"]*self.data['Rates']['gpu_per_node_hour']
                return `
                <form class="ba ma3 br2 br--bottom" data-action="user/application/PS-HPA" data-source="user/application/PS-HPA" data-component="Application-HP">
                    <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                    <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                        <tbody>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">Application Id</td>
                                <td class="pv2 w-20 ph3"></td>

                                <td class="pv2 w-30 ph3 bl">CPU core hours</td>
                                <td class="pv2 w-20 ph3"><input name="cpu_core_hour" oninput="update_application_amount(this, `+self.data['Rates']['cpu_per_core_hour']+`, `+ self.data['Rates']['gpu_per_node_hour']+`)" class="w-100 bg-white-40 ba br2" type="number" value="`+self.data["AccountType"]["default_cpu_core_hours"]+`" /></td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">Payment Mode</td>
                                <td class="pv2 ph3">Project<input type="hidden" name="payment_mode" value="Project"</td>

                                <td class="pv2 ph3 bl">GPU node hours</td>
                                <td class="pv2 ph3"><input name="gpu_node_hour" oninput="update_application_amount(this, `+self.data['Rates']['cpu_per_core_hour']+`, `+ self.data['Rates']['gpu_per_node_hour']+`)" class="w-100 bg-white-40 ba br2" type="number" value="`+self.data["AccountType"]["default_gpu_node_hours"]+`" /></td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">Stage</td>
                                <td class="pv2 ph3"><input class="bg-white-40 ba br2" type="submit" value="Apply"/></td>

                                <td class="pv2 ph3 bl">Amount</td>
                                <td class="pv2 ph3"><span class="amount">₹`+Number(default_amount).toLocaleString('en-In')+`</span></td>
                            </tr>
                        </tbody>
                    </table>
                </form>`
            }
        },
        view: function() {
            if (self.status != 404) {
                return `
                <div data-source="user/application/PS-HPA" data-component="Application-HP">
                    `+self.application(self)+`
                </div>
                `
            }
            else {
                return `<div class="tc" data-source="user/application/PS-HPA" data-component="Application-HP">Please complete your Work Profile to apply for an account.</div>`
            }
        },
        "onupdate": function() {
            //param_hp_application_amount.innerHTML = Number(self.data['Rates']['cpu_per_core_hour']*param_hp_application_cpu.value + self.data['Rates']['gpu_per_node_hour']*param_hp_application_gpu.value).toLocaleString('en-IN')
        }
    },
    "Application-HP-Guide": {
        stage: function(data) {
            if (data.admin_time) {
                return `Active`
            }
            // else if (data.pi_time) {
            //     return `Admin Approval`
            // }
            else {
                return `Admin Approval`
            }
        },
        application: function(self) {
            if ("Application" in self.data) {

                return `
                <section class="ba ma3 br2 br--bottom">
                        <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                        <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                            <tbody>
                                <tr class="striped--light-gray">
                                    <td class="pv2 w-30 ph3">Application Id</td>
                                    <td class="pv2 w-20 ph3">`+self.data["Application"]["application_id"]+`</td>

                                    <td class="pv2 ph3 bl">Payment Mode</td>
                                    <td class="pv2 ph3">Project</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 w-30 ph3">CPU core hours</td>
                                    <td class="pv2 w-20 ph3">`+Number(self.data["Application"]["cpu_core_hour"]).toLocaleString("en-IN")+`</td>

                                    <td class="pv2 w-30 ph3 bl">Project No.</td>
                                    <td class="pv2 w-30 ph3">`+self.data["Application"]["project_no"]+`</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">GPU node hours</td>
                                    <td class="pv2 ph3">`+Number(self.data["Application"]["gpu_node_hour"]).toLocaleString("en-IN")+`</td>

                                    <td class="pv2 w-30 ph3 bl">Budget head</td>
                                    <td class="pv2 w-30 ph3">`+self.data["Application"]["budget_head"]+`</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">Amount</td>
                                    <td class="pv2 ph3">₹`+Number(self.data["Application"]["amount"]).toLocaleString("en-IN")+`</td>

                                    <td class="pv2 ph3 bl">Stage</td>
                                    <td class="pv2 ph3">`+self.stage(self.data["Application"])+`</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>`
            }
            else {
                return `
                <form class="ba ma3 br2 br--bottom" data-source="user/application/PS-HPA" data-action="user/application/PS-HPA" data-component="Application-HP-Guide">
                    <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                    <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                        <tbody>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">Application Id</td>
                                <td class="pv2 w-20 ph3"></td>

                                <td class="pv2 ph3 bl">Payment Mode</td>
                                <td class="pv2 ph3">Project<input type="hidden" name="payment_mode" value="Project"/></td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">CPU core hours</td>
                                <td class="pv2 w-20 ph3"><input name="cpu_core_hour" type="number" class="w-100 bg-white-40 ba br2" oninput="update_application_amount(this, `+self.data['Rates']['cpu_per_core_hour']+`, ` + self.data['Rates']['gpu_per_node_hour'] +`)" type="text" value="`+self.data["AccountType"]["default_cpu_core_hours"]+`" min="0" step="`+self.data["cpu_step"]+`"/></td>
                                
                                <td class="pv2 w-30 ph3 bl">Project No.</td>
                                <td class="pv2 w-30 ph3"><input name="project_no" class="bg-white-40 ba br2" type="text" list="project_list" required/></td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">GPU node hours</td>
                                <td class="pv2 ph3"><input name="gpu_node_hour" type="number" class="w-100 bg-white-40 ba br2" oninput="update_application_amount(this, `+self.data['Rates']['cpu_per_core_hour']+`, ` + self.data['Rates']['gpu_per_node_hour'] +`)" type="text" value="`+self.data["AccountType"]["default_gpu_node_hours"]+`" min="0" step="`+self.data["gpu_step"]+`"/></td>

                                <td class="pv2 w-30 ph3 bl">Budget Head</td>
                                <td class="pv2 w-30 ph3"><input name="budget_head" class="bg-white-40 ba br2" type="text" list="budget_head"/></td>                                
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">Amount</td>
                                <td class="pv2 ph3 amount">₹`+Number(self.data['Rates']['cpu_per_core_hour']*self.data["AccountType"]["default_cpu_core_hours"] + self.data['Rates']['gpu_per_node_hour']*self.data["AccountType"]["default_gpu_node_hours"]).toLocaleString('en-IN')+`</td>

                                <td class="pv2 ph3 bl">Stage</td>
                                <td class="pv2 ph3"><input class="bg-white-40 ba br2" type="submit" value="Apply"/></td>
                            </tr>
                        </tbody>
                    </table>
                </form>`
            }
        },
        view: function() {
            if (self.status != 404) {
                return `
                <div data-source="user/application/PS-HPA" data-component="Application-HP-Guide">
                    `+self.application(self)+`
                </div>
                `
            }
            else {
                return `<div class="tc" data-source="user/application/PS-HPA" data-component="Application-HP-Guide">Please complete your Work Profile to apply for an account.</div>`
            }
        },
        "onupdate": function() {
            // param_hp_application_amount_guide.innerHTML = Number(self.data['Rates']['cpu_per_core_hour']*param_hp_application_cpu.value + self.data['Rates']['gpu_per_node_hour']*param_hp_application_gpu.value).toLocaleString('en-IN')
        }
    },

    "Topup-HP": {
        stage: function(data) {
            if (portal === 'User') {
                if (data.admin_time) {
                    return `Active`
                }
                // else if (data.rnd_time) {
                //     return `Admin Approval`
                // }
                else if (data.pi_time) {
                    return `Admin Approval`
                }
                else {
                    return `PI Approval`
                }
            }
            else {
                if (data.admin_time) {
                    return `Active`
                }
                // else if (data.rnd_time) {
                //     return `Admin Approval`
                // }
                else {
                    return `Admin Approval`
                }
            }
        },
        describe: function(data) {
            list = ``

            for (let topup of data) {
                list+=`
                    <tr class="striped--light-gray">
                        <td class="pv2 ph3">`+topup["request_at"]+`</td>
                        <td class="pv2 ph4 tr">`+Number(topup["hours"]).toLocaleString('en-In')+`</td>
                        <td class="pv2 ph3 tr">₹`+Number(topup["amount"]).toLocaleString('en-In')+`</td>
                        <td class="pv2 ph3">`+topup["payment_mode"]+`</td>
                        <td class="pv2 ph3">`+self.stage(topup)+`</td>
                    </tr>`
            }

             return list
        },
        title: function(resource) {
            if (resource === 'cpu')
                return "CPU Topup Requests"
            if (resource === 'gpu')
                return "GPU Topup Requests"
        },
        view: function() {
            return `<form data-source="user/topup/`+self.data["resource"]+`/`+self.data["account_type"]+`" data-action="user/topup/`+self.data["resource"]+`/`+self.data["account_type"]+`" class="ba mv3 mh3 br2 br--bottom" data-component="Topup-HP">
            <header class="bg-color1 color2 pa2">
                `+self.title(self.data["resource"])+`
            </header>
            <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                <tbody>
                    <tr class="striped--light-gray">
                        <td class="pv2 w-10 ph3">Request Date</td>
                        <td class="pv2 w-20 ph3 tr">`+self.data["unit"][self.data["resource"]]+`</td>
                        <td class="pv2 w-20 ph3 tr">Amount</td>
                        <td class="pv2 w-20 ph3">Payment Source</td>
                        <td class="pv2 w-30 ph3">Stage</td>
                    </tr>
                    <tr class="striped--light-gray">
                        <td class="pv2 ph3">`+self.data["date"]+`</td>
                        <td class="pv2 ph3"><input oninput="update_amount_in_next_cell(this, `+self.data["Rates"]["per_hour"][self.data["resource"]]+`)" class="w-100 bg-white-40 ba br2 tr" name="hours" type="number" min="0" step="`+self.data["Rates"]["unit_recharge"][self.data["resource"]]+`" required value="`+self.data["Rates"]["unit_recharge"][self.data["resource"]]+`" /></td>
                        <td class="pv2 ph3 tr">₹`+Number(self.data["Rates"]["unit_recharge"][self.data["resource"]] * self.data["Rates"]["per_hour"][self.data["resource"]]).toLocaleString("en-IN")+`</td>
                        <td class="pv2 ph3">
                            <select class="bg-white-40 ba br2" name="payment_mode">
                                <option>Project</option>
                                <option>Bank</option>
                            </select>
                        </td>
                        <td class="pv2 ph3">
                                <input type="submit" value="Apply"/>
                        </td>
                    </tr>
                    `+self.describe(self.data["Topup"])+`
                </tbody>
            </table>
        </form>`
        }
    },
    "Topup-HP-Guide": {
        stage: function(data) {
            if (portal === 'User') {
                if (data.admin_time) {
                    return `Active`
                }
                // else if (data.rnd_time) {
                //     return `Admin Approval`
                // }
                else if (data.pi_time) {
                    return `Admin Approval`
                }
                else {
                    return `PI Approval`
                }
            }
            else {
                if (data.admin_time) {
                    return `Active`
                }
                else {
                    return `Admin Approval`
                }
            }
        },
        describe: function(data) {
            list = ``

            for (let topup of data) {
                list+=`
                    <tr class="striped--light-gray">
                        <td class="pv2 ph3">`+topup["request_at"]+`</td>
                        <td class="pv2 ph4 tr">`+Number(topup["hours"]).toLocaleString('en-In')+`</td>
                        <td class="pv2 ph3 tr">₹`+Number(topup["amount"]).toLocaleString('en-In')+`</td>
                        <td class="pv2 ph3">`+topup["payment_mode"]+`</td>
                        <td class="pv2 ph3">`+topup["project_no"]+`<br/>`+topup["budget_head"]+`</td>
                        <td class="pv2 ph3">`+self.stage(topup)+`</td>
                    </tr>`
            }

             return list
        },
        title: function(resource) {
            if (resource === 'cpu')
                return "CPU Topup Requests"
            if (resource === 'gpu')
                return "GPU Topup Requests"
        },
        view: function() {
            return `<form data-source="user/topup/`+self.data["resource"]+`/`+self.data["account_type"]+`" data-action="user/topup/`+self.data["resource"]+`/`+self.data["account_type"]+`" class="ba mv3 mh3 br2 br--bottom" data-component="Topup-HP-Guide">
            <header class="bg-color1 color2 pa2">
                `+self.title(self.data["resource"])+`
            </header>
            <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                <tbody>
                    <tr class="striped--light-gray">
                        <td class="pv2 w-10 ph3">Request Date</td>
                        <td class="pv2 w-20 ph3 tr">`+self.data["unit"][self.data["resource"]]+`</td>
                        <td class="pv2 w-20 ph3 tr">Amount</td>
                        <td class="pv2 w-20 ph3">Payment Source</td>
                        <td class="pv2 w-20 ph3">Project Info</td>
                        <td class="pv2 w-30 ph3">Stage</td>
                    </tr>
                    <tr class="striped--light-gray">
                        <td class="pv2 ph3">`+self.data["date"]+`</td>
                        <td class="pv2 ph3"><input oninput="update_amount_in_next_cell(this, `+self.data["Rates"]["per_hour"][self.data["resource"]]+`)" class="w-100 bg-white-40 ba br2 tr" name="hours" type="number" min="0" step="`+self.data["Rates"]["unit_recharge"][self.data["resource"]]+`" required value="`+self.data["Rates"]["unit_recharge"][self.data["resource"]]+`" /></td>
                        <td class="pv2 ph3 tr">₹`+Number(self.data["AccountType"]["default_amounts"][self.data["resource"]]).toLocaleString("en-IN")+`</td>
                        <td class="pv2 ph3">Project<input type="hidden" name="payment_mode" value="Project"/></td>
                        <td class="pv2 ph3">
                            <input name="project_no" class="bg-white-40 ba br2" type="text" placeholder="Project no." list="project_list" required/>
                            <input name="budget_head" class="bg-white-40 ba br2" type="text" placeholder="Budget head" list="budget_head"/>
                        </td>
                        <td class="pv2 ph3">
                                <input class="bg-white-40 ba br2" type="submit" value="Apply"/>
                        </td>
                    </tr>
                    `+self.describe(self.data["Topup"])+`
                </tbody>
            </table>
        </form>`
        }
    },
    "Application-RA": {
        stage: function(data) {
            if (data.admin_time) {
                return `Active`
            }
            // else if (data.rnd_time) {
            //     return `Admin Approval`
            // }
            else if (data.pi_time) {
                return `Admin Approval`
            }
            else {
                return `PI Approval`
            }
        },
        application: function(self) {
    
        
                if ("Application" in self.data) {

                return `
                <section class="ba ma3 br2 br--bottom">
                        <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                        <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                            <tbody>
                                <tr class="striped--light-gray">
                                    <td class="pv2 w-30 ph3">Application Id</td>
                                    <td class="pv2 w-20 ph3">`+self.data["Application"]["application_id"]+`</td>

                                    <td class="pv2 w-30 ph3 bl">Request Date</td>
                                    <td class="pv2 w-20 ph3">`+self.data["Application"]["request_at"]+`</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 w-30 ph3">CPU core hours</td>
                                    <td class="pv2 w-20 ph3">`+Number(self.data["Application"]["cpu_core_hour"]).toLocaleString("en-IN")+`</td>

                                    <td class="pv2 ph3 bl">GPU node hours</td>
                                    <td class="pv2 ph3">`+Number(self.data["Application"]["gpu_node_hour"]).toLocaleString("en-IN")+`</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">Stage</td>
                                    <td class="pv2 ph3">`+self.stage(self.data["Application"])+`</td>

                                    <td class="pv2 ph3 bl">Amount</td>
                                    <td class="pv2 ph3">₹`+Number(self.data["Application"]["amount"]).toLocaleString("en-IN")+`</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>`
            }
            else {
                return `
                <form class="ba ma3 br2 br--bottom" data-source="user/application/PS-RA" data-action="user/application/PS-RA" data-component="Application-RA">
                    <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                    <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                        <tbody>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">Application Id</td>
                                <td class="pv2 w-20 ph3"></td>

                                <td class="pv2 w-30 ph3 bl">Request Date</td>
                                <td class="pv2 w-20 ph3"></td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">CPU core hours</td>
                                <td class="pv2 w-20 ph3"><input class="w-100 bg-white-40 ba br2 tr" oninput="update_application_amount(this, `+self.data['Rates']['cpu_per_core_hour']+`, ` + self.data['Rates']['gpu_per_node_hour'] +`)" name="cpu_core_hour" type="number" min="0" step="20000" value="0"/></td>

                                <td class="pv2 ph3 bl">GPU node hours</td>
                                <td class="pv2 ph3"><input class="w-100 bg-white-40 ba br2 tr" oninput="update_application_amount(this, `+self.data['Rates']['cpu_per_core_hour']+`, ` + self.data['Rates']['gpu_per_node_hour'] +`)" name="gpu_node_hour" type="number" min="0" step="600" value="0"/></td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">Stage</td>
                                <td class="pv2 ph3"><input class="bg-white-40 ba br2" type="submit" value="Apply"/></td>

                                <td class="pv2 ph3 bl">Amount</td>
                                <td class="pv2 ph3 amount">₹`+Number(self.data['Rates']['cpu_per_core_hour']*self.data["AccountType"]["default_cpu_core_hours"] + self.data["AccountType"]["default_gpu_node_hours"]).toLocaleString('en-IN')+`</td>
                            </tr>
                        </tbody>
                    </table>
                </form>`
            }
        },
        view: function() {
            if (self.status != 404) {
            return `
            <div data-source="user/application/PS-RA" data-component="Application-RA">
                `+self.application(self)+`
            </div>
            `
            }
            else {
                return `<div class="tc" data-source="user/application/PS-RA" data-component="Application-RA">Please complete your Work Profile to apply for an account.</div>`
            }
        },
        "onupdate": function() {
            //param_hp_application_amount.innerHTML = Number(self.data['Rates']['cpu_per_core_hour']*param_hp_application_cpu.value + self.data['Rates']['gpu_per_node_hour']*param_hp_application_gpu.value).toLocaleString('en-IN')
        }
    },
    "Application-RA-Guide": {
        stage: function(data) {
            if (data.admin_time) {
                return `Active`
            }
            // else if (data.rnd_time) {
            //     return `Admin Approval`
            // }
            else {
                return `Admin Approval`
            }
        },
        application: function(self) {
            if ("Application" in self.data) {

                return `
                <section class="ba ma3 br2 br--bottom">
                        <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                        <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                            <tbody>
                                <tr class="striped--light-gray">
                                    <td class="pv2 w-30 ph3">Application Id</td>
                                    <td class="pv2 w-20 ph3">`+self.data["Application"]["application_id"]+`</td>

                                    <td class="pv2 w-30 ph3 bl">Request Date</td>
                                    <td class="pv2 w-20 ph3">`+self.data["Application"]["request_at"]+`</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 w-30 ph3">Pool Allocation</td>
                                    <td class="pv2 w-20 ph3">`+(self.data["Application"]["pool_allocation"] ? '✔' : '✖')+`</td>

                                    <td class="pv2 ph3 bl">Payment Mode</td>
                                    <td class="pv2 ph3">`+self.data["Application"]["payment_mode"]+`</td> 
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 w-30 ph3">CPU core hours</td>
                                    <td class="pv2 w-20 ph3">`+Number(self.data["Application"]["cpu_core_hour"]).toLocaleString("en-IN")+`</td>

                                    <td class="pv2 ph3 bl">Project No.</td>
                                    <td class="pv2 ph3">`+self.data["Application"]["project_no"]+`</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">GPU node hours</td>
                                    <td class="pv2 ph3">`+( (self.data["Application"]["gpu_node_hour"] > -1) ? Number(self.data["Application"]["gpu_node_hour"]).toLocaleString("en-IN") : "N/A")+`</td>
                                    
                                    <td class="pv2 ph3 bl">Budget Head</td>
                                    <td class="pv2 ph3">`+self.data["Application"]["budget_head"]+`</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">Amount</td>
                                    <td class="pv2 ph3">₹`+Number(self.data["Application"]["amount"]).toLocaleString("en-IN")+`</td>

                                    <td class="pv2 ph3 bl">Stage</td>
                                    <td class="pv2 ph3">`+self.stage(self.data["Application"])+`</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>`
            }
            else {
                return `
                <form class="ba ma3 br2 br--bottom" data-source="user/application/PS-RA" data-action="user/application/PS-RA" data-component="Application-RA-Guide">
                    <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                    <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                        <tbody>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">Application Id</td>
                                <td class="pv2 w-20 ph3"></td>

                                <td class="pv2 w-30 ph3 bl">Request Date</td>
                                <td class="pv2 w-20 ph3"></td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">Pool Allocation</td>
                                <td class="pv2 w-20 ph3"><input type="checkbox" name="pool_allocation"/></td>

                                <td class="pv2 ph3 bl">Payment Mode</td>
                                <td class="pv2 ph3">
                                    <select name="payment_mode" class="bg-white-40 ba br2" onchange="set_payment_mode(this)">
                                        <option>Project</option>
                                        <option>Bank</option>
                                    </select>
                                </td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">CPU core hours</td>
                                <td class="pv2 w-20 ph3"><input class="bg-white-40 ba br2" oninput="update_application_amount(this, `+self.data["Rates"]["cpu_per_core_hour"]+`, `+ self.data["Rates"]["gpu_per_node_hour"]+ `)" type="number" name="cpu_core_hour" value="20000" min="20000" step="20000"/></td>

                                <td class="pv2 w-30 ph3 bl">Project No.</td>
                                <td class="pv2 w-30 ph3"><input name="project_no" class="bg-white-40 ba br2" type="text" list="project_list" required/></td>                                
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">GPU node hours</td>
                                <td class="pv2 ph3"><input class="bg-white-40 ba br2" oninput="update_application_amount(this, `+self.data["Rates"]["cpu_per_core_hour"]+`, `+ self.data["Rates"]["gpu_per_node_hour"]+ `)" type="number" name="gpu_node_hour" value="0" min="0" step="600"/></td>

                                <td class="pv2 w-30 ph3 bl">Budget Head</td>
                                <td class="pv2 w-30 ph3"><input name="budget_head" class="bg-white-40 ba br2" type="text" list="budget_head"/></td>                                
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">Amount</td>
                                <td class="pv2 ph3 amount">₹300</td>

                                <td class="pv2 ph3 bl">Stage</td>
                                <td class="pv2 ph3"><input class="bg-white-40 ba br2" type="submit" value="Apply"/></td>
                            </tr>
                        </tbody>
                    </table>
                </form>`
            }
        },
        view: function() {
            if (self.status != 404) {
                return `
                <div data-source="user/application/PS-RA"  data-component="Application-RA-Guide">
                    `+self.application(self)+`
                </div>
                `
            }
            else {
                return `
                <section class="ba ma3 br2 br--bottom" data-source="user/application/PS-RA" data-component="Application-RA-Guide">
                    <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                    <div class="tc pa4 bg-light-gray">Please complete your Work Profile to apply for an account.</div>
                </section>`
            }
        },
        "onupdate": function() {
            //param_hp_application_amount.innerHTML = Number(self.data['Rates']['cpu_per_core_hour']*param_hp_application_cpu.value + self.data['Rates']['gpu_per_node_hour']*param_hp_application_gpu.value).toLocaleString('en-IN')
        }
    },

    "Topup-RA": {
        stage: function(data) {
            if (portal === 'User') {
                if (data.admin_time) {
                    return `Active`
                }
                // else if (data.rnd_time) {
                //     return `Admin Approval`
                // }
                else if (data.pi_time) {
                    return `Admin Approval`
                }
                else {
                    return `PI Approval`
                }
            }
            else {
                if (data.admin_time) {
                    return `Active`
                }
                // else if (data.rnd_time) {
                //     return `Admin Approval`
                // }
                else {
                    return `Admin Approval`
                }
            }
        },
        describe: function(date, data) {
            list = ``

            for (let topup of data["Topup"]) {
                list+=`
                    <tr class="striped--light-gray">
                        <td class="pv2 ph3">`+topup["request_at"]+`</td>
                        <td class="pv2 ph4 tr">`+Number(topup["hours"]).toLocaleString('en-In')+`</td>
                        <td class="pv2 ph3 tr">₹`+Number(topup["amount"]).toLocaleString('en-In')+`</td>
                        <td class="pv2 ph3">`+self.stage(topup)+`</td>
                    </tr>`
            }

             return list
        },
        title: function(resource) {
            if (resource === 'cpu')
                return "CPU Topup Requests"
            if (resource === 'gpu')
                return "GPU Topup Requests"
        },
        view: function() {
            return `<form data-source="user/topup/`+self.data["resource"]+`/`+self.data["account_type"]+`" data-action="user/topup/`+self.data["resource"]+`/`+self.data["account_type"]+`" class="ba mv3 mh3 br2 br--bottom" data-component="Topup-RA">
            <header class="bg-color1 color2 pa2">
                `+self.title(self.data["resource"])+`
            </header>
            <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                <tbody>
                    <tr class="striped--light-gray">
                        <td class="pv2 ph3 w-20">Request Date</td>
                        <td class="pv2 w-20 ph3 tr">`+self.data["unit"][self.data["resource"]]+`</td>
                        <td class="pv2 ph3 w-20 tr">Amount</td>
                        <td class="pv2 ph3 w-20">Stage</td>
                    </tr>
                    <tr class="striped--light-gray">
                        <td class="pv2 ph3">`+self.data["date"]+`</td>
                        <td class="pv2 ph3"><input oninput="update_amount_in_next_cell(this, `+self.data["Rates"]["per_hour"][self.data["resource"]]+`)" class="w-100 bg-white-40 ba br2 tr" name="hours" type="number" min="0" step="`+self.data["Rates"]["unit_recharge"][self.data["resource"]]+`" required value="`+self.data["Rates"]["unit_recharge"][self.data["resource"]]+`" /></td>
                        <td class="pv2 ph3 tr">₹`+Number(self.data["Rates"]["unit_recharge"][self.data["resource"]] * self.data["Rates"]["per_hour"][self.data["resource"]]).toLocaleString("en-IN")+`</td>
                        <td class="pv2 ph3">
                                <input type="submit" value="Apply"/>
                        </td>
                    </tr>
                    `+self.describe(self.data["date"], self.data)+`
                </tbody>
            </table>
        </form>`
        }
    },

    "Topup-RA-Guide": {
        stage: function(data) {
            if (portal === 'User') {
                if (data.admin_time) {
                    return `Active`
                }
                // else if (data.rnd_time) {
                //     return `Admin Approval`
                // }
                else if (data.pi_time) {
                    return `Admin Approval`
                }
                else {
                    return `PI Approval`
                }
            }
            else {
                if (data.admin_time) {
                    return `Active`
                }
                // else if (data.rnd_time) {
                //     return `Admin Approval`
                // }
                else {
                    return `Admin Approval`
                }
            }
        },
        describe: function(date, data) {
            list = ``

            for (let topup of data["Topup"]) {
                list+=`
                    <tr class="striped--light-gray">
                        <td class="pv2 ph3">`+topup["request_at"]+`</td>
                        <td class="pv2 ph4 tr">`+Number(topup["hours"]).toLocaleString('en-In')+`</td>
                        <td class="pv2 ph3 tr">₹`+Number(topup["amount"]).toLocaleString('en-In')+`</td>
                        <td class="pv2 ph3">`+topup["payment_mode"]+`</td>
                        <td class="pv2 ph3">`+(topup["project_no"] ? topup["project_no"] : '') +`<br/>`+(topup["budget_head"] ? topup["budget_head"] : '')+`</td>
                        <td class="pv2 ph3">`+self.stage(topup)+`</td>
                    </tr>`
            }

             return list
        },
        title: function(resource) {
            if (resource === 'cpu')
                return "CPU Topup Requests"
            if (resource === 'gpu')
                return "GPU Topup Requests"
        },
        view: function() {
            return `<form data-source="user/topup/`+self.data["resource"]+`/`+self.data["account_type"]+`" data-action="user/topup/`+self.data["resource"]+`/`+self.data["account_type"]+`" class="ba mv3 mh3 br2 br--bottom" data-component="Topup-RA-Guide">
            <header class="bg-color1 color2 pa2">
                `+self.title(self.data["resource"])+`
            </header>
            <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                <tbody>
                    <tr class="striped--light-gray">
                        <td class="pv2 w-10 ph3">Request Date</td>
                        <td class="pv2 w-20 ph3 tr">`+self.data["unit"][self.data["resource"]]+`</td>
                        <td class="pv2 w-20 ph3 tr">Amount</td>
                        <td class="pv2 w-20 ph3">Payment Source</td>
                        <td class="pv2 w-20 ph3">Project Info</td>
                        <td class="pv2 w-30 ph3">Stage</td>
                    </tr>
                    <tr class="striped--light-gray">
                        <td class="pv2 ph3 w-15">`+self.data["date"]+`</td>
                        <td class="pv2 ph3"><input oninput="update_amount_in_next_cell(this, `+self.data["Rates"]["per_hour"][self.data["resource"]]+`)" class="w-100 bg-white-40 ba br2 tr" name="hours" type="number" min="0" step="`+self.data["Rates"]["unit_recharge"][self.data["resource"]]+`" required value="`+self.data["Rates"]["unit_recharge"][self.data["resource"]]+`" /></td>
                        <td class="pv2 ph3 w-10 tr">₹`+Number(self.data["Rates"]["unit_recharge"][self.data["resource"]]*self.data["Rates"]["per_hour"][self.data["resource"]]).toLocaleString("en-IN")+`</td>
                        <td class="pv2 ph3 s-20">
                            <select class="bg-white-40 ba br2" name="payment_mode" onchange="set_payment_mode(this)">
                                <option>Project</option>
                                <option>Bank</option>
                            </select>
                        </td>
                        <td class="pv2 ph3 w-20">
                            <input name="project_no" class="bg-white-40 ba br2" type="text" placeholder="Project no." list="project_list" required/>
                            <input name="budget_head" class="bg-white-40 ba br2" type="text" placeholder="Budget head" list="budget_head"/>
                        </td>
                        <td class="pv2 ph3 w-20">
                                <input type="submit" value="Apply"/>
                        </td>
                    </tr>
                    `+self.describe(self.data["date"], self.data)+`
                </tbody>
            </table>
        </form>`
        }
    },

    "Application-QA": {
        stage: function(data) {
            if (data.admin_time) {
                return `Active`
            }
            // else if (data.rnd_time) {
            //     return `Admin Approval`
            // }
            else if (data.pi_time) {
                return `Admin Approval`
            }
            else {
                return `PI Approval`
            }
        },
        duration: function(id, rate) {
            return `<select name="duration" onchange="` + id + `_amount.innerText='₹' + (this.value-0)*`+rate+`" class="bg-white-40 ba br2 w-90">
                    <option value='1'> 1 Quarter  (Nov 2024 - Jan 2025) </option>
                    <option value='2'> 2 Quarters (Nov 2024 - April 2025)</option>
                    <!-- <option value='3'> 3Q (Till 31<sup>st</sup> March 2024)</option>
                    <option value='4'> 4Q (Till 30<sup>st</sup> June 2024)</option> -->
                </select>`
        },
        screenshot: function(data) {
            if ("Application" in data && "screenshot" in data["Application"]) {
                return `Uploaded`
            }
            else if ("Application" in data && data["Application"]["pi_time"] && data["Application"]["payment_mode"] == "Bank") {
                return `<input type="file" name="screenshot"/> <input type="submit" value="Upload"/>`
            }
            return `Upload after PI Approval`
        },
        application: function(self) {
            if ("Application" in self.data) {
                return `
                <form class="ba ma3 br2 br--bottom" data-source="user/application/`+self.data["account_type"]+`" data-action="user/application/`+self.data["account_type"]+`" data-component="Application-QA">
                        <header class="bg-color1 color2 pa2 flex justify-between">Application</header>
                        <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                            <tbody>
                                <tr class="striped--light-gray">
                                    <input type="hidden" name="application_id" value="`+self.data["Application"]["application_id"]+`"/>
                                    <td class="pv2 w-20 ph3">Application Id</td>
                                    <td class="pv2 w-20 ph3">`+self.data["Application"]["application_id"]+`</td>

                                    <td class="pv2 w-20 ph3 bl">Quarters</td>
                                    <td class="pv2 w-40 ph3">`+self.data["Application"]["duration"]+`</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">Payment Mode</td>
                                    <td class="pv2 ph3">`+self.data["Application"]["payment_mode"]+`</td>

                                    <td class="pv2 ph3 bl">Amount</td>
                                    <td class="pv2 ph3">₹`+Number(self.data["Application"]["amount"]).toLocaleString("en-IN")+`</td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">Stage</td>
                                    <td class="pv2 ph3">`+self.stage(self.data["Application"])+`</td>

                                    <td class="pv2 ph3 bl"></td>
                                    <td class="pv2 ph3"></td>
                                </tr>
                            </tbody>
                        </table>
                    </section>`
            }
            else {
                return `
                <form class="ba ma3 br2 br--bottom" data-source="user/application/`+self.data["account_type"]+`" data-action="user/application/`+self.data["account_type"]+`" data-component="Application-QA">
                    <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                    <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                        <tbody>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-20 ph3">Application Id</td>
                                <td class="pv2 w-20 ph3"></td>

                                <td class="pv2 w-20 ph3 bl">Duration</td>
                                <td class="pv2 w-40 ph3">`+self.duration('hpc2013', self.data["rate"])+`<input type="hidden" name="cpu" value="`+`"/></td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">Payment Mode</td>
                                <td class="pv2 ph3">
                                    <select name="payment_mode" class="bg-white-40 ba br2">
                                        <option>Project</option>
                                        <option>Bank</option>
                                    </select>
                                </td>

                                <td class="pv2 ph3 bl">Amount</td>
                                <td id="hpc2013_amount" class="pv2 ph3">₹`+self.data["rate"]+`</td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">Stage</td>
                                <td class="pv2 ph3"><input class="bg-white-40 ba br2" type="submit" value="Apply"/></td>                                

                                <td class="pv2 ph3 bl"></td>
                                <td class="pv2 ph3"></td>
                            </tr>
                        </tbody>
                    </table>
                </form>`
            }
        },
        view: function() {
            if (self.status != 404) {
                return `
                <div data-source="user/application/HPC2013-QA" data-component="Application-QA">
                    `+self.application(self)+`
                </div>
                `
            }
            else {
                return `<div class="tc" data-source="user/application/HPC2013-QA" data-component="Application-QA">Please complete your Work Profile to apply for an account.</div>`
            }
        },
        "onupdate": function() {
            // hpc2013_amount.innerText='₹' + Number(self.data["rate"])
        }
    },
    "Application-QA-Guide": {
        stage: function(data) {
            if (data.admin_time) {
                return `Active`
            }
            // else if (data.rnd_time) {
            //     return `Admin Approval`
            // }
            else if (data.pi_time) {
                return `Admin Approval`
            }
            else {
                return `<!--<input type="checkbox" name="delete_request"/> Delete Request<br/>-->
                <input type="submit" value="Save"/>
                `
            }
        },
        payment_mode: function(mode) {
            return `
            <select name="payment_mode" onchange="set_payment_mode(this)">
                <option>Project</option>
                <option>Bank</option>
            </select>`

        },
        application: function(self) {
            //console.log(self.data)
            if ("Application" in self.data && self.data["Application"]["pi_time"]) {
                return `
                <div class="ba ma3 br2 br--bottom">
                    <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                    <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                        <tbody>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">Application Id</td>
                                <td class="pv2 w-20 ph3">`+self.data["Application"]["application_id"]+`</td>

                                <td class="pv2 ph3 bl">Payment Mode</td>
                                <td class="pv2 ph3">`+self.data["Application"]["payment_mode"]+`</td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">Quarters</td>
                                <td class="pv2 w-20 ph3">`+self.data["Application"]["duration"]+`</td>

                                <td class="pv2 w-30 ph3 bl">Project No.</td>
                                <td class="pv2 w-30 ph3">`+(self.data["Application"]["project_no"] != null ? self.data["Application"]["project_no"] : "N/A") +`</td>                                
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3"></td>
                                <td class="pv2 ph3"></td>

                                <td class="pv2 w-30 ph3 bl">Budget Head</td>
                                <td class="pv2 w-30 ph3">`+(self.data["Application"]["budget_head"] != null ? self.data["Application"]["budget_head"] : "N/A") +`</td>                                
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">Amount</td>
                                <td class="pv2 ph3 amount">₹`+Number(self.data["Application"]["amount"]).toLocaleString("en-IN")+`</td>

                                <td class="pv2 ph3 bl">Stage</td>
                                <td class="pv2 ph3">`+self.stage(self.data["Application"])+`</td>
                            </tr>
                        </tbody>
                    </table>
                </div>`
            }
            else {
                return `
                <form class="ba ma3 br2 br--bottom" data-source="user/application/`+self.data["account_type"]+`" data-action="user/application/`+self.data["account_type"]+`" data-component="Application-QA-Guide">
                    <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                    <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                        <tbody>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-20 ph3">Application Id</td>
                                <td class="pv2 w-30 ph3"></td>

                                <td class="pv2 ph3 bl">Payment Mode</td>
                                <td class="pv2 ph3">`+self.payment_mode()+`</td>
                            </tr>
                            <tr class="striped--light-gray">

                                <td class="pv2 w-20 ph3">Quarters</td>
                                <td class="pv2 w-30 ph3">
                                <select name="duration" onchange="update_application_amount_QA(this, `+self.data["rate"]+ `)" class="bg-white-40 ba br2 w-90">
                                    <option value='1'> 1 Quarter  (Nov 2024 - Jan 2025) </option>
                                    <option value='2'> 2 Quarters (Nov 2024 - April 2025)</option>
                                </select>

                                <td class="pv2 w-20 ph3 bl">Project No.</td>
                                <td class="pv2 w-30 ph3"><input name="project_no" class="bg-white-40 ba br2" type="text" value="" list="project_list" required/></td>                                
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3"></td>
                                <td class="pv2 ph3"></td>

                                <td class="pv2 w-20 ph3 bl">Budget Head</td>
                                <td class="pv2 w-30 ph3"><input name="budget_head" class="bg-white-40 ba br2" type="text" value="" list="budget_head"/></td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">Amount</td>
                                <td class="pv2 ph3 amount">₹`+Number(self.data["rate"]).toLocaleString("en-IN")+`</td>

                                <td class="pv2 ph3 bl">Stage</td>
                                <td class="pv2 ph3">`+self.stage(self.data)+`</td>
                            </tr>
                        </tbody>
                    </table>
                </form>`
            }
        },
        view: function() {
            if (self.status != 404) {
                 return `
                <div data-source="user/application/`+self.data["account_type"]+`" data-component="Application-QA-Guide">
                    `+self.application(self)+`
                </div>
                `
            }
            else {
                return `<div class="tc" data-source="user/application/HPC2013-QA" data-component="Application-QA">Please complete your Work Profile to apply for an account.</div>`
            }
        },
        "onupdate": function(component) {
            //update_application_amount(component, self.data["Rates"]["cpu_per_core_hour"], self.data["Rates"]["gpu_per_node_hour"])
            //param_hp_application_amount.innerHTML = Number(self.data['Rates']['cpu_per_core_hour']*param_hp_application_cpu.value + self.data['Rates']['gpu_per_node_hour']*param_hp_application_gpu.value).toLocaleString('en-IN')
        }
            /*
            stage: function(data) {
                if (data.admin_time) {
                    return `Active`
                }
                else if (data.rnd_time) {
                    return `Admin Approval`
                }
                else {
                    return `RnD Approval`
                }
            },
            application: function(self) {
                if ("Application" in self.data) {
                    return `
                    <section class="ba ma3 br2 br--bottom">
                            <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                            <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                                <tbody>
                                    <tr class="striped--light-gray">
                                        <td class="pv2 w-30 ph3">Application Id</td>
                                        <td class="pv2 w-20 ph3">`+self.data["Application"]["application_id"]+`</td>

                                        <td class="pv2 ph3 bl">Payment Mode</td>
                                        <td class="pv2 ph3">`+self.data["Application"]["payment_mode"]+`</td> 
                                    </tr>
                                    <tr class="striped--light-gray">
                                        <td class="pv2 w-30 ph3">CPU core hours</td>
                                        <td class="pv2 w-20 ph3">`+Number(self.data["Application"]["cpu_core_hour"]).toLocaleString("en-IN")+`</td>

                                        <td class="pv2 ph3 bl">Project No.</td>
                                        <td class="pv2 ph3">`+self.data["Application"]["project_no"]+`</td>
                                    </tr>
                                    <tr class="striped--light-gray">
                                        <td class="pv2 ph3">GPU node hours</td>
                                        <td class="pv2 ph3">`+( (self.data["Application"]["gpu_node_hour"] > -1) ? Number(self.data["Application"]["gpu_node_hour"]).toLocaleString("en-IN") : "N/A")+`</td>
                                        
                                        <td class="pv2 ph3 bl">Budget Head</td>
                                        <td class="pv2 ph3">`+self.data["Application"]["budget_head"]+`</td>
                                    </tr>
                                    <tr class="striped--light-gray">
                                        <td class="pv2 ph3">Amount</td>
                                        <td class="pv2 ph3">₹`+Number(self.data["Application"]["amount"]).toLocaleString("en-IN")+`</td>

                                        <td class="pv2 ph3 bl">Stage</td>
                                        <td class="pv2 ph3">`+self.stage(self.data["Application"])+`</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>`
                }
                else {
                    return `
                    <form class="ba ma3 br2 br--bottom" data-source="user/application/`+self.data["account_type"]+`" data-action="user/application/`+self.data["account_type"]+`" data-component="Application-RA-Guide">
                        <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                        <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                            <tbody>
                                <tr class="striped--light-gray">
                                    <td class="pv2 w-30 ph3">Application Id</td>
                                    <td class="pv2 w-20 ph3"></td>

                                    <td class="pv2 ph3 bl">Payment Mode</td>
                                    <td class="pv2 ph3">
                                        <select name="payment_mode" class="bg-white-40 ba br2">
                                            <option>Project</option>
                                            <option>Bank</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 w-30 ph3">CPU core hours</td>
                                    <td class="pv2 w-20 ph3">`+self.data["AccountType"]["default_cpu_core_hours"]+`<input type="hidden" name="cpu" value="`+self.data["AccountType"]["default_cpu_core_hours"]+`"/></td>

                                    <td class="pv2 w-30 ph3 bl">Project No.</td>
                                    <td class="pv2 w-30 ph3"><input name="project_no" class="bg-white-40 ba br2" type="text"/></td>                                
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">GPU node hours</td>
                                    <td class="pv2 ph3">`+(self.data["AccountType"]["default_gpu_node_hours"] > -1 ? Number(self.data["AccountType"]["default_gpu_node_hours"]).toLocaleString("en-IN") : "N/A")+`<input type="hidden" name="gpu" value="`+self.data["AccountType"]["default_gpu_node_hours"]+`"/></td>

                                    <td class="pv2 w-30 ph3 bl">Budget Head</td>
                                    <td class="pv2 w-30 ph3"><input name="budget_head" class="bg-white-40 ba br2" type="text"/></td>                                
                                </tr>
                                <tr class="striped--light-gray">
                                    <td class="pv2 ph3">Amount</td>
                                    <td class="pv2 ph3">₹`+Number(self.data['Rates']['cpu_per_core_hour']*self.data["AccountType"]["default_cpu_core_hours"] + self.data['Rates']['gpu_per_node_hour']*(self.data["AccountType"]["default_gpu_node_hours"] > -1 ? self.data["AccountType"]["default_gpu_node_hours"] : 0)).toLocaleString('en-IN')+`</td>

                                    <td class="pv2 ph3 bl">Stage</td>
                                    <td class="pv2 ph3"><input class="bg-white-40 ba br2" type="submit" value="Apply"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </form>`
                }
            },
            view: function() {
                if (self.status != 404) {
                    return `
                    <div data-source="user/application/`+self.data["account_type"]+`"  data-component="Application" data-reload="param_hp_application">
                        `+self.application(self)+`
                    </div>
                    `
                }
                else {
                    return `<div class="tc">Please complete your Work Profile and refresh the page to apply for an account.</div>`
                }
            },
            "onupdate": function() {
                param_hp_application_amount.innerHTML = Number(self.data['Rates']['cpu_per_core_hour']*param_hp_application_cpu.value + self.data['Rates']['gpu_per_node_hour']*param_hp_application_gpu.value).toLocaleString('en-IN')
            }*/
    },


    "GroupMembers": {
        view: function() {
            details = `<details class="mt4" open="" data-component="GroupMembers" data-source="user/group_members">
            <summary class="f3">Group Members</summary>`

            for (let member in self.data) {
                details += `<details id="`+self.data[member]["username"]+`" class="mt2 pl4">
                                <summary class="f3">` + member + `</summary>

                                <h2 class="f3 ml3">Param Sanganak - Regular Access</h2>

                                <section class="ba ma3 br2 br--bottom overflow-hidden" data-source="group/`+self.data[member]["username"]+`/application/PS-RA" data-component="Application-Group-Student">
                                    <span class="pa2">Loading ...</span>
                                </section> 

                                <section class="ba ma3 br2 br--bottom overflow-hidden" data-source="group/`+self.data[member]["username"]+`/topup/cpu/PS-RA" data-component="Topup-Student-HPA">
                                    <span class="pa2">Loading ...</span>
                                </section>

                                <section class="ba ma3 br2 br--bottom overflow-hidden" data-source="group/`+self.data[member]["username"]+`/topup/gpu/PS-RA" data-component="Topup-Student-HPA">
                                    <span class="pa2">Loading ...</span>
                                </section>

                                <h2 class="f3 ml3">Param Sanganak - High Priority Access</h2>

                                <section class="ba ma3 br2 br--bottom overflow-hidden" data-source="group/`+self.data[member]["username"]+`/application/PS-HPA" data-component="Application-Group-Student">
                                    <span class="pa2">Loading ...</span>
                                </section> 

                                <section class="ba ma3 br2 br--bottom overflow-hidden" data-source="group/`+self.data[member]["username"]+`/topup/cpu/PS-HPA" data-component="Topup-Student-HPA">
                                    <span class="pa2">Loading ...</span>
                                </section>

                                <section class="ba ma3 br2 br--bottom overflow-hidden" data-source="group/`+self.data[member]["username"]+`/topup/gpu/PS-HPA" data-component="Topup-Student-HPA">
                                    <span class="pa2">Loading ...</span>
                                </section>

                                <h2 class="f3 ml3">HPC2013 - Quarterly Access</h2>

                                <section class="ba ma3 br2 br--bottom overflow-hidden" data-source="group/`+self.data[member]["username"]+`/application/HPC2013-QA" data-component="Application-Group-Student-QA">
                                    <span class="pa2">Loading ...</span>
                                </section> 

                                <!-- <section class="ba ma3 br2 br--bottom overflow-hidden" data-source="group/`+self.data[member]["username"]+`/topup/cpu/HPC2013-QA" data-component="Topup-Student-HPA">
                                    <span class="pa2">Loading ...</span>
                                </section> -->

                                <!-- <section class="ba ma3 br2 br--bottom overflow-hidden" data-source="group/`+self.data[member]["username"]+`/topup/gpu/HPC2013-QA" data-component="Topup-Student-HPA">
                                    <span class="pa2">Loading ...</span>
                                </section> -->
                                </details>
                            </details>\n`
            }

            details += `</details>`

            return details
        },

        "onupdate": function() {
            for (let member in self.data) {
                student_detail = document.getElementById(self.data[member]["username"])
                render_components_in(student_detail)
            }
        }
    },

    "Application-Group-Student": {
        stage: function(data) {
            if (data.admin_time) {
                return `Active`
            }
            // else if (data.rnd_time) {
            //     return `Admin Approval`
            // }
            else if (data.pi_time) {
                return `Admin Approval`
            }
            else {
                return `<!--<input type="checkbox" name="delete_request"/> Delete Request<br/>-->
                <input type="submit" value="Recommend"/>
                `
            }
        },
        payment_mode: function(account_type, mode) {
        if (account_type == 'PS-HPA') {
              return `Project <input type='hidden' name='payment_mode' value='Project'/>`
            }
            else {

                    return `
                    <select name="payment_mode" onchange="set_payment_mode(this)">
                        <option `+( (mode == 'Project') ? 'selected' : '')+`>Project</option>
                        <option `+( (mode == 'Bank') ? 'selected' : '' )+`>Bank</option>
                    </select>`
           }

        },
        application: function(self) {
            if (!!self.data["Application"]["pi_time"]) {
                return `
                <div class="ba ma3 br2 br--bottom">
                    <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                    <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                        <tbody>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">Application Id</td>
                                <td class="pv2 w-20 ph3">`+self.data["Application"]["application_id"]+`</td>

                                <td class="pv2 w-30 ph3 bl">Request Date</td>
                                <td class="pv2 w-20 ph3">`+self.data["Application"]["request_at"]+`</td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">Pool Allocation</td>
                                <td class="pv2 ph3">`+(self.data["Application"]["pool_allocation"] ? '✔' : '✖')+`</td>

                                <td class="pv2 ph3 bl">Payment Mode</td>
                                <td class="pv2 ph3">`+self.data["Application"]["payment_mode"]+`</td>

                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">CPU core hours</td>
                                <td class="pv2 w-20 ph3">`+self.data["Application"]["cpu_core_hour"]+`</td>

                                <td class="pv2 w-30 ph3 bl">Project No.</td>
                                <td class="pv2 w-30 ph3">`+self.data["Application"]["project_no"]+`</td>                                
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">GPU node hours</td>
                                <td class="pv2 ph3">`+self.data["Application"]["gpu_node_hour"]+`</td>

                                <td class="pv2 w-30 ph3 bl">Budget Head</td>
                                <td class="pv2 w-30 ph3">`+self.data["Application"]["budget_head"]+`</td>                                
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">Amount</td>
                                <td class="pv2 ph3 amount">₹`+Number(self.data["Application"]["amount"]).toLocaleString("en-IN")+`</td>

                                <td class="pv2 ph3 bl">Stage</td>
                                <td class="pv2 ph3">`+self.stage(self.data["Application"])+`</td>
                            </tr>
                        </tbody>
                    </table>
                </div>`
            }
            else {
                let input_project = (self.data["Application"]["payment_mode"] == 'Project') ? 'required' : 'disabled';

                payment_mode = self.data["Application"]["payment_mode"]

                return `
                <form class="ba ma3 br2 br--bottom" data-source="group/`+self.data["username"]+`/application/`+self.data["account_type"]+`" data-action="group/`+self.data["username"]+`/application/`+self.data["account_type"]+`" data-component="Application-Group-Student">
                    <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                    <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                        <tbody>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">Application Id</td>
                                <td class="pv2 w-20 ph3">`+self.data["Application"]["application_id"]+`</td>

                                <td class="pv2 w-30 ph3 bl">Request Date</td>
                                <td class="pv2 w-20 ph3">`+self.data["Application"]["request_at"]+`</td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">Pool Allocation</td>
                                <td class="pv2 w-20 ph3"><input onclick="pool(this)" type="checkbox" name="pool_allocation"/></td>

                                <td class="pv2 ph3 bl">Payment Mode</td>
                                <td class="pv2 ph3">`+self.payment_mode(self.data["account_type"], payment_mode)+`</td>
                            </tr>

                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">CPU core hours</td>
                                <td class="pv2 w-20 ph3"><input oninput="update_application_amount(this, `+self.data["Rates"]["cpu_per_core_hour"]+`, `+ self.data["Rates"]["gpu_per_node_hour"]+ `)" class="w-100 bg-white-40 ba br2 tr" name="cpu_core_hour" type="number" min="0" step="`+self.data["cpu_step"]+`" required value="`+self.data["Application"]["cpu_core_hour"]+`"/></td>

                                <td class="pv2 w-30 ph3 bl">Project No.</td>
                                <td class="pv2 w-30 ph3"><input name="project_no" class="bg-white-40 ba br2" type="text" value="`+self.data["Application"]["project_no"]+`" list="project_list_for_group" ` +input_project+ `/></td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">GPU node hours</td>
                                <td class="pv2 ph3"><input oninput="update_application_amount(this, `+self.data["Rates"]["cpu_per_core_hour"]+`, `+ self.data["Rates"]["gpu_per_node_hour"]+ `)" class="w-100 bg-white-40 ba br2 tr" name="gpu_node_hour" type="number" min="0" step="`+self.data["gpu_step"]+`" required value="`+self.data["Application"]["gpu_node_hour"]+`"/></td>

                                <td class="pv2 w-30 ph3 bl">Budget Head</td>
                                <td class="pv2 w-30 ph3"><input name="budget_head" class="bg-white-40 ba br2" type="text" value="`+self.data["Application"]["budget_head"]+`" list="budget_head"/></td>                                
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">Amount</td>
                                <td class="pv2 ph3 amount">₹</td>

                                <td class="pv2 ph3 bl">Stage</td>
                                <td class="pv2 ph3">`+self.stage(self.data)+`</td>
                            </tr>
                        </tbody>
                    </table>
                </form>`
            }
        },
        view: function() {
            if (self.status == 200) {
                return `
                <div data-source="group/`+self.data["username"]+`/application/`+self.data["account_type"]+`" data-component="Application-Group-Student">
                    `+self.application(self)+`
                </div>
                `
            }
            else {
                return `<div class="pl4 mt2">No Application</div>`
            }
        },
        "onupdate": function(component) {
            update_application_amount(component, self.data["Rates"]["cpu_per_core_hour"], self.data["Rates"]["gpu_per_node_hour"])
            //param_hp_application_amount.innerHTML = Number(self.data['Rates']['cpu_per_core_hour']*param_hp_application_cpu.value + self.data['Rates']['gpu_per_node_hour']*param_hp_application_gpu.value).toLocaleString('en-IN')
        }
    },


    "Application-Group-Student-QA": {
        stage: function(data) {
            if (data.admin_time) {
                return `Active`
            }
            // else if (data.rnd_time) {
            //     return `Admin Approval`
            // }
            else if (data.pi_time) {
                return `Admin Approval`
            }
            else {
                return `<!--<input type="checkbox" name="delete_request"/> Delete Request<br/>-->
                <input type="submit" value="Recommend"/>
                `
            }
        },
        payment_mode: function(mode) {
            return `
            <select name="payment_mode" onchange="set_payment_mode(this)">
                <option `+( (mode == 'Project') ? 'selected' : '')+`>Project</option>
                <option `+( (mode == 'Bank') ? 'selected' : '' )+`>Bank</option>
            </select>`

        },
        application: function(self) {
            if (!!self.data["Application"]["pi_time"]) {
                return `
                <div class="ba ma3 br2 br--bottom">
                    <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                    <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                        <tbody>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">Application Id</td>
                                <td class="pv2 w-20 ph3">`+self.data["Application"]["application_id"]+`</td>

                                <td class="pv2 ph3 bl">Payment Mode</td>
                                <td class="pv2 ph3">`+self.data["Application"]["payment_mode"]+`</td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">Quarters</td>
                                <td class="pv2 w-20 ph3">`+self.data["Application"]["duration"]+`</td>

                                <td class="pv2 w-30 ph3 bl">Project No.</td>
                                <td class="pv2 w-30 ph3">`+self.data["Application"]["project_no"]+`</td>                                
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3"></td>
                                <td class="pv2 ph3"></td>

                                <td class="pv2 w-30 ph3 bl">Budget Head</td>
                                <td class="pv2 w-30 ph3">`+self.data["Application"]["budget_head"]+`</td>                                
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">Amount</td>
                                <td class="pv2 ph3 amount">₹`+Number(self.data["Application"]["amount"]).toLocaleString("en-IN")+`</td>

                                <td class="pv2 ph3 bl">Stage</td>
                                <td class="pv2 ph3">`+self.stage(self.data["Application"])+`</td>
                            </tr>
                        </tbody>
                    </table>
                </div>`
            }
            else {
            let input_project = (self.data["Application"]["payment_mode"] == 'Project') ? 'required' : 'disabled'
                return `
                <form class="ba ma3 br2 br--bottom" data-source="group/`+self.data["username"]+`/application/`+self.data["account_type"]+`" data-action="group/`+self.data["username"]+`/application/`+self.data["account_type"]+`" data-component="Application-Group-Student-QA">
                    <header class="bg-color1 color2 pa2 flex justify-between">Application</header>

                    <table class="collapse ba br2 b--black-10 pv2 ph3 w-100">
                        <tbody>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">Application Id</td>
                                <td class="pv2 w-20 ph3">`+self.data["Application"]["application_id"]+`</td>

                                <td class="pv2 ph3 bl">Payment Mode</td>
                                <td class="pv2 ph3">`+self.payment_mode(self.data["Application"]["payment_mode"])+`</td>
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 w-30 ph3">Quarters</td>
                                <td class="pv2 w-20 ph3"><input oninput="update_application_amount_QA(this, `+self.data["rate"]+ `)" class="w-100 bg-white-40 ba br2 tr" name="duration" type="number" min="1" max="2" step="1" required value="`+self.data["Application"]["duration"]+`"/></td>

                                <td class="pv2 w-30 ph3 bl">Project No.</td>
                                <td class="pv2 w-30 ph3"><input name="project_no" class="bg-white-40 ba br2" type="text" value="`+self.data["Application"]["project_no"]+`" list="project_list_for_group" ` +input_project+ `/></td>                                
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3"></td>
                                <td class="pv2 ph3"></td>

                                <td class="pv2 w-30 ph3 bl">Budget Head</td>
                                <td class="pv2 w-30 ph3"><input name="budget_head" class="bg-white-40 ba br2" type="text" value="`+self.data["Application"]["budget_head"]+`" list="budget_head"/></td>                                
                            </tr>
                            <tr class="striped--light-gray">
                                <td class="pv2 ph3">Amount</td>
                                <td class="pv2 ph3 amount">₹`+Number(self.data["Application"]["duration"]*self.data["rate"]).toLocaleString("en-IN")+`</td>

                                <td class="pv2 ph3 bl">Stage</td>
                                <td class="pv2 ph3">`+self.stage(self.data)+`</td>
                            </tr>
                        </tbody>
                    </table>
                </form>`
            }
        },
        view: function() {
            if (self.status == 200) {
                return `
                <div data-source="group/`+self.data["username"]+`/application/`+self.data["account_type"]+`" data-component="Application-Group-Student">
                    `+self.application(self)+`
                </div>
                `
            }
            else {
                return `<div class="pl4 mt2">No Application</div>`
            }
        },
        "onupdate": function(component) {
            update_application_amount(component, self.data["Rates"]["cpu_per_core_hour"], self.data["Rates"]["gpu_per_node_hour"])
            //param_hp_application_amount.innerHTML = Number(self.data['Rates']['cpu_per_core_hour']*param_hp_application_cpu.value + self.data['Rates']['gpu_per_node_hour']*param_hp_application_gpu.value).toLocaleString('en-IN')
        }
    },

    "Topup-Student-HPA": {
        stage: function(data) {
            if (data.admin_time) {
                return `Active`
            }
            // else if (data.pi_time) {
            //     return `Admin Approval`
            // }
            else {
                return `Admin Approval`
            }
        },
        project_details: function(project_name, budget_head) {
            if (budget_head.length > 0) {
                return project_name + '<br/>(' + budget_head + ')'
            }
            else {
                return project_name
            }
        },
        payment_mode: function(account_type, mode) {
            if (account_type == 'PS-HPA') {
              return `Project <input type='hidden' name='payment_mode' value='Project'/>`
            }
            else {

                return `
                    <select name="payment_mode" onchange="set_payment_mode(this)">
                        <option `+( (mode == 'Project') ? 'selected' : '')+`>Project</option>
                        <option `+( (mode == 'Bank') ? 'selected' : '' )+`>Bank</option>
                        <option `+( (mode == 'Pool') ? 'selected' : '' )+`>Pool</option>
                    </select>`
           }
        },
        describe: function(account_type, data) {

            list = ``

            for (let topup of data) {
                payment_mode = topup["payment_mode"]

                if (topup["pool_allocation"] === true)
                    payment_mode = "Pool"

                let input_project = (payment_mode == 'Project') ? 'required' : 'disabled'


                if (!!topup.pi_time) {
                    list+=`
                        <div class="striped--light-gray">
                            <div class="pv2 ph3 w-10 dib tc">`+topup["request_at"]+`</div>
                            <div class="pv2 ph4 w-20 dib tr">`+Number(topup["hours"]).toLocaleString('en-In')+`</div>
                            <div class="pv2 ph3 w-10 dib tr">₹`+Number(topup["amount"]).toLocaleString('en-In')+`</div>
                            <div class="pv2 ph3 w-10 dib tc">`+payment_mode+`</div>
                            <div class="pv2 ph3 w-20 dib tl">`+self.project_details(topup["project_no"], topup["budget_head"])+`</div>
                            <div class="pv2 ph3 w-20 dib tr">`+self.stage(topup)+`</div>
                        </div>`
                }
                else {
                    list += `
                        <form class="striped--light-gray" data-action="group/`+self.data["username"]+`/topup/`+self.data["resource"]+`/`+self.data["account_type"]+`" method="POST" onsubmit="topup_group_submit(event)">
                            <input type="hidden" name="id" value="`+topup["id"]+`"/>
                            <div class="pv2 ph3 w-10 dib tc">`+topup["request_at"]+`</div>
                            <div class="pv2 ph3 w-20 dib tr"><input name="hours" oninput="update_amount_in_next_cell(this, `+self.data["Rates"]["per_hour"][self.data["resource"]]+`)" class="w-80 bg-white-40 ba br2 tr" type="number" min="`+self.data["Rates"]["unit_recharge"][self.data["resource"]]+`" step="`+self.data["Rates"]["unit_recharge"][self.data["resource"]]+`" required value="`+topup["hours"]+`" /></div>
                            <div class="pv2 ph3 w-10 dib tr">₹`+Number(topup["amount"]).toLocaleString('en-In')+`</div>
                            <div class="pv2 ph3 w-10 dib tc">`+self.payment_mode(account_type, payment_mode)+`</div>
                            <div class="pv2 ph3 w-20 dib tc">
                                <input name="project_no" class="bg-white-40 ba br2 w-90" type="text" placeholder="Project no." list="project_list_for_group" `+input_project+`/>
                                <input name="budget_head" class="bg-white-40 ba br2 w-90" type="text" placeholder="Budget head" list="budget_head"/>
                            </div>
                            <div class="pv2 ph3 w-20 dib tc">
                                <!--<input type="checkbox" name="delete_request"/> Delete Request<br/>-->
                                <input class="bg-white-40 ba br2" type="submit" value="Recommend"/>
                            </div>
                        </form>`
                }
            }

            return list
        },
        title: function(resource) {
            if (resource === 'cpu')
                return "CPU Topup Requests"
            if (resource === 'gpu')
                return "GPU Topup Requests"
        },
        view: function() {
            if (self.status == 200) {
                    return `<div data-source="group/`+self.data["username"]+`/topup/`+self.data["resource"]+`/`+self.data["account_type"]+`" data-action="group/`+self.data["username"]+`/topup/`+self.data["resource"]+`/`+self.data["account_type"]+`" class="ba mv3 mh3 br2 br--bottom get-only" data-component="Topup-Student-HPA">
                    <header class="bg-color1 color2 pa2">
                        `+self.title(self.data["resource"])+`
                    </header>
                    <div class="ba br2 b--black-10 w-100">
                            <div class="striped--light-gray">
                                <div class="pv2 w-10 ph3 dib tc">Request Date</div>
                                <div class="pv2 w-20 ph3 dib tr">`+self.data["unit"][self.data["resource"]]+`</div>
                                <div class="pv2 w-10 ph3 dib tr">Amount</div>
                                <div class="pv2 w-10 ph3 dib tc">Payment Mode</div>
                                <div class="pv2 w-20 ph3 dib tl">Project Info</div>
                                <div class="pv2 w-20 ph3 dib tc">Stage</div>
                            </div>
                            `+self.describe(self.data["account_type"], self.data["Topups"], self)+`
                    </table>
                </div>`
            }
            else if (self.status == 404) {
                return `<span class="pl4 mt2 db">Topup: No active user account</span>`
            }
            else if (self.data["user_account"] == "None") {
                return `<span class="pl4 mt2 db">Topup `+self.data["resource"].toUpperCase()+`: No active user account</span>`
            }
        }
    }
}
