'use strict'


$(document).ready(function() {
    console.log("TRYING TO HIDE")
    $('#showEditForm input').hide();
    $('#showEditForm textarea').hide();
})

const $newSelector = $('#edit')

$newSelector.click(function () {
    console.log("TRYING TO SHOW")
    $('#showEditForm input').show();
    $('#showEditForm textarea').show();
})
