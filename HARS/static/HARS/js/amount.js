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

    console.log(currentInput)

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