let editMode = false;
let editRow = null;

function addItem()
{
    const itemEntryForm = document.getElementById('item_entry');
    const productName = itemEntryForm.elements[0].value;
    const rate = parseFloat(itemEntryForm.elements[1].value);
    const qty = parseInt(itemEntryForm.elements[2].value);
    const amount = rate * qty;

    if (productName && !isNaN(rate) && !isNaN(qty) && rate >= 0.01 && qty >= 1) 
    {
        const itemListTable = document.getElementById('item_list');
        const insertIndex = itemListTable.rows.length - 4;
        
        if (editMode && editRow) 
        {
            // Update the row in place
            editRow.cells[1].textContent = productName;
            editRow.cells[2].textContent = rate.toFixed(2);
            editRow.cells[3].textContent = qty;
            editRow.cells[4].textContent = amount.toFixed(2);

            // Restore background
            editRow.style.backgroundColor = "rgb(252, 248, 244)";
            editMode = false;
            editRow = null;
            renumberRows();
            updateTotal();
            itemEntryForm.reset();
            return;
        }
        
        const newRow = itemListTable.insertRow(insertIndex);
        
        const cellNo = newRow.insertCell(0);
        const cellName = newRow.insertCell(1);
        const cellRate = newRow.insertCell(2);
        const cellQty = newRow.insertCell(3);
        const cellAmount = newRow.insertCell(4);
        const cellEdit = newRow.insertCell(5);
        const cellDelete = newRow.insertCell(6);

        cellNo.textContent = itemListTable.rows.length - 5; // Adjust for header and total rows
        cellName.textContent = productName;
        cellRate.textContent = rate.toFixed(2);
        cellQty.textContent = qty;
        cellAmount.textContent = amount.toFixed(2);

        // Style for product name cell to handle long names
        cellName.style.width = "250px";
        cellName.style.maxWidth = "250px";
        cellName.style.wordWrap = "break-word";
        cellName.style.overflowWrap = "break-word";
        cellName.style.whiteSpace = "normal";

        cellNo.className = "general_cell center_cell";
        cellName.className = "general_cell";
        cellRate.className = "general_cell num_cell";
        cellQty.className = "general_cell num_cell";
        cellAmount.className = "general_cell num_cell";
        cellEdit.className = "general_cell button_cell";
        cellDelete.className = "general_cell button_cell";

        

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = '✎';
        editBtn.onclick = function() 
        {
            if (editMode) 
            {
                renumberRows();
                updateTotal();
                return

            }; // Prevent editing multiple rows at once
            editMode = true;
            editRow = newRow;
            newRow.style.backgroundColor = "bisque";
            itemEntryForm.elements[0].value = cellName.textContent;
            itemEntryForm.elements[1].value = cellRate.textContent;
            itemEntryForm.elements[2].value = cellQty.textContent;
        };
        cellEdit.appendChild(editBtn);

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑';
        delBtn.onclick = function() 
        {
            itemListTable.deleteRow(newRow.rowIndex);
            if (editMode && editRow === newRow) 
            {
                // If the deleted row was being edited, exit edit mode
                editMode = false;
                editRow = null;
                itemEntryForm.reset();
            }
            renumberRows();
            updateTotal()
        };
        cellDelete.appendChild(delBtn);

        updateTotal()

        itemEntryForm.reset();
    } 
    else 
    {
        validateForm(itemEntryForm);
    }
    renumberRows();
    updateTotal();
}

function removeEntry() 
{
    const itemEntryForm = document.getElementById('item_entry');
    if (editMode && editRow) {
        // Cancel edit: restore background, clear form, exit edit mode
        editRow.style.backgroundColor = "rgb(252, 248, 244)";
        editMode = false;
        editRow = null;
        itemEntryForm.reset();
    } else {
        // Optionally, clear the form if not editing
        itemEntryForm.reset();
    }
    renumberRows();
    updateTotal();
}

function renumberRows() 
{
    const itemListTable = document.getElementById('item_list');
    for (let i = 1; i < itemListTable.rows.length - 4; i++) 
    {
        itemListTable.rows[i].cells[0].textContent = i; // Update row number
    }
}
function updateTotal() 
{
    const itemListTable = document.getElementById('item_list');
    let total = 0;

    for (let i = 1; i < itemListTable.rows.length - 4; i++) 
    {
        const amount = parseFloat(itemListTable.rows[i].cells[4].textContent);
        total += amount;
    }

    const cgst = total * 0.025;
    const sgst = total * 0.025;
    const finalTotal = total + cgst + sgst;

    let totalQty = 0;
    for (let i = 1; i < itemListTable.rows.length - 4; i++) 
    {
        const qty = parseInt(itemListTable.rows[i].cells[3].textContent);
        totalQty += qty;
    }

    document.getElementById('total_qty').textContent = totalQty; // Number of items
    document.getElementById('total_amount').textContent = total.toFixed(2);
    document.getElementById('cgst').textContent = cgst.toFixed(2);
    document.getElementById('sgst').textContent = sgst.toFixed(2);
    document.getElementById('final').textContent = finalTotal.toFixed(2);
}

function printInvoice() 
{
    const invDetForm = document.getElementById('inv_det');
    if (!validateForm(invDetForm)) 
    {
        alert("Please fill in all invoice details correctly.");
        return;
    }
    window.print();
}

function validateForm(form) {
    let valid = true;
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('input-error');
            valid = false;
        } else {
            input.classList.remove('input-error');
        }
    });
    return valid;
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function() {
            document.querySelectorAll('input.input-error').forEach(errInput => {
                errInput.classList.remove('input-error');
            });
        });
    });
});