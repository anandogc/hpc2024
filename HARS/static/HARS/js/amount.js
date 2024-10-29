// https://stackoverflow.com/a/41699140/1525392
function escapeHtml(str)
{
    var map =
    {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, function(m) {return map[m];});
}

function decodeHtml(str)
{
    var map =
    {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'"
    };
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) {return map[m];});
}

function update_amount_in_next_cell(currentInput, rate) {

    // Get the parent cell (td)
    const parentCell = currentInput.parentElement;

    // Get the next cell (td)
    const nextCell = parentCell.nextElementSibling;

    // Update the content of the next cell with the input's value
    if (nextCell) {
        nextCell.textContent = "₹" + Number(currentInput.value * rate).toLocaleString("en-IN");
    }
}

function update_in_row(currentInput, identifier, rate) {

    // Get the parent cell (td)
    const parentRow = currentInput.parentElement.parentElement;

    // Get the next cell (td)
    const nextCell = parentRow.querySelector(identifier);

    // Update the content of the next cell with the input's value
    if (nextCell) {
        let hours = currentInput.value * rate
        nextCell.innerHTML = Number(hours).toLocaleString("en-IN") + `<input type="hidden" name="hours" value="`+hours+`"/>`;
    }
}

function update_application_amount(currentInput, cpu_rate, gpu_rate) {
    let form = currentInput.closest('form');

    if (!form) {
        form = currentInput.querySelector('form')
    }

    let cpu_hours = Number(form.querySelector('[name=cpu_core_hour]').value)
    let gpu_hours = Number(form.querySelector('[name=gpu_node_hour]').value)
    let amount_container = form.querySelector('.amount')

    let amount = cpu_hours * cpu_rate + gpu_hours * gpu_rate

    amount_container.textContent = '₹' + Number(amount).toLocaleString('en-In')
}


function update_application_amount_QA(currentInput, rate) {
    let form = currentInput.closest('form');

    if (!form) {
        form = currentInput.querySelector('form')
    }

    let duration = currentInput.value
    let amount_container = form.querySelector('.amount')

    let amount = duration * rate

    amount_container.textContent = '₹' + Number(amount).toLocaleString('en-In')
}

function set_payment_mode(select) {
    let form = select.closest('form');

    if (!form) {
        form = select.querySelector('form')
    }

    let project_no = form.querySelector('input[name=project_no]')
    let budget_head = form.querySelector('input[name=budget_head]')

    if (select.value == "Project") {
        project_no.setAttribute('required', 'required')
        budget_head.setAttribute('required', 'required')

        project_no.removeAttribute('disabled')
        budget_head.removeAttribute('disabled')
    }

    else if (select.value == "Bank" || select.value == "Pool") {
        project_no.removeAttribute('required')
        budget_head.removeAttribute('required')

        project_no.setAttribute('disabled', 'disabled')
        budget_head.setAttribute('disabled', 'disabled')
    }

}

function stage(data) {
    if (data.admin_time) {
        return `Active`
    }
    else if (data.rnd_time) {
        return `Admin Approval`
    }
    else {
        return `RnD Approval`
    }
}

function project_details(project_name, budget_head) {
    if (budget_head.length > 0) {
        return project_name + '<br/>(' + budget_head + ')'
    }
    else {
        return project_name
    }
}


async function topup_group_submit(event) {
    event.preventDefault();

    for (const el of event.target.querySelectorAll("[required]")) {
      el.classList.remove('b--dark-red')
      el.parentElement.classList.remove('b--dark-red')

      if (el.value === '') {        
        if (el.type !== 'hidden') {
            el.classList.add('b--dark-red')
            el.focus()
            return;
        }
        else {
            el.parentElement.classList.add('b--dark-red')
            el.parentElement.querySelector('input').focus()
            return;
        }
      }
    }

    message.showLoader("Processing request")
    let that = event.target;
    
    const data = {}
    
        
    for (const pair of new FormData(event.target)) {        
        if (pair[1] instanceof File) {
            let dataURL = await readFileAsDataURL(pair[1]);
            let file = [pair[1].name, pair[1].size, dataURL]

            data[pair[0]] = file
    
        }
        else {
            data[pair[0]] = pair[1]
        }
    }   
    
    let method = event.target.getAttribute('data-method')
    if (method === null)
        method = "POST"

    let action = event.target.getAttribute('data-action');
    if (!action) {
        action = event.target.getAttribute('data-source')
    }

    let url = location.href

    if (url.substr(-1) != '/') url += '/';
    if (action[0] == '/') action = action.substr(1);

    
    console.log("Submitting at", url, action)

    fetch(url+action, {
        method: method,
         headers: {
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(data),
    }).then(function(response) {

        if (response.status == 200) {
            response.json().then(function(topup) {

                message.closeMessage()
                let new_topup = document.createElement('div')
                new_topup.classList.add('striped--light-gray')
                new_topup.innerHTML = `
                        <div class="pv2 ph3 w-10 dib tc">`+topup["request_at"]+`</div>
                        <div class="pv2 ph4 w-20 dib tr">`+Number(topup["hours"]).toLocaleString('en-In')+`</div>
                        <div class="pv2 ph3 w-10 dib tr">₹`+Number(topup["amount"]).toLocaleString('en-In')+`</div>
                        <div class="pv2 ph3 w-10 dib tc">`+topup["payment_mode"]+`</div>
                        <div class="pv2 ph3 w-20 dib tl">`+project_details(topup["project_no"], topup["budget_head"])+`</div>
                        <div class="pv2 ph3 w-20 dib tr">`+stage(topup)+`</div>`

                let form = event.target.closest('form');

                form.parentNode.replaceChild(new_topup, form);
            })
        }
        else {
            response.text().then((text) => {
                message.error(text)
            })      
        }
    })

    return false
}

function pool(checkbox) {
    if (checkbox.checked) {

        let form = checkbox.closest('form');

        form.querySelector('[name=cpu_core_hour]').value = 0
        form.querySelector('[name=cpu_core_hour]').disabled = true

        form.querySelector('[name=gpu_node_hour]').value = 0
        form.querySelector('[name=gpu_node_hour]').disabled = true

        form.querySelector('.amount').textContent = '₹0'


        form.querySelector('[name=payment_mode]').disabled = true

        form.querySelector('[name=project_no]').textContent = ''
        form.querySelector('[name=project_no]').disabled = true
        form.querySelector('[name=project_no]').required = false

        form.querySelector('[name=budget_head]').textContent = ''
        form.querySelector('[name=budget_head]').disabled = true
        form.querySelector('[name=budget_head]').required = false
    } else {

        let form = checkbox.closest('form');
        form.querySelector('[name=cpu_core_hour]').disabled = false
        form.querySelector('[name=gpu_node_hour]').disabled = false

        form.querySelector('[name=payment_mode]').disabled = false
        form.querySelector('[name=project_no]').disabled = false
        form.querySelector('[name=budget_head]').disabled = false

        set_payment_mode(form.querySelector('[name=payment_mode]'))
    }
}