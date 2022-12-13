'use strict';

$(document).ready(function() {

    MostrarNotificacion('Bienvenidos', '#00f900');

    let TaskList = [];

    if (localStorage.TaskList) {
        TaskList = JSON.parse(localStorage.TaskList);
    }

    UptateTaskList();

    let order = $('#Order').change(()=>{

        if (order.val() <= 0) {

            order.val('');

            MostrarNotificacion('Orden no valido', '#ff0000');
        }

    })

    $('#btnCreate').click(()=>{

        let order = $('#Order').val();
        let task = $('#Task').val();
        let color = $('#Color').val();

        if ($('#btnCreate').html() == 'Añadir') {
            
            if (CreateTask(order, task, color)) {

                $('#Order').val('');
                $('#Task').val('');
                $('#Color').val('#cccccc');
    
                MostrarNotificacion('Tarea creada correctamente', '#00ff00');
               
            } else{
                setTimeout(() => {
                    MostrarNotificacion('Error al crear', '#0000ff');
                }, 2500);
            }   

        } else if ($('#btnCreate').html() == 'Modificar') {
            if (UpdateTask(order, task, color)) {
                $('#Order').val('');
                $('#Task').val('');
                $('#Color').val('#cccccc');

                $('#btnCreate').html('Añadir');
    
                MostrarNotificacion('Tarea actualizada correctamente', '#00ff00');
            } else{
                setTimeout(() => {
                    MostrarNotificacion('Error al actualizar', '#0000ff');
                }, 2500);
            }   
        }

    })

    function CreateTask(Order, Task, Color) {

        if (Order === '' || Task === '') {
            MostrarNotificacion('Diligencia los campos requeridos', '#ff0000');
            return false;
        }

        for (let i = 0; i < TaskList.length; i++) {
            if (TaskList[i].Order == Order) {
                $('#Notificacion').show();
                $('#Notificacion').html(`Existe tarea con el orden ${Order}`);
                $('#Notificacion').css('background', '#ff0000');
                setTimeout(() => {
                    $('#Notificacion').hide();
                }, 2000);
                return false;
            }
            if (TaskList[i].Task == Task) {
                $('#Notificacion').show();
                $('#Notificacion').html(`Ya existe la tarea "${Task}"`);
                $('#Notificacion').css('background', '#ff0000');
                setTimeout(() => {
                    $('#Notificacion').hide();
                }, 2000);
                return false;
            }
        }

        TaskList.push({'Order':Order,'Task':Task,'Color':Color,'Complete':'false'});

        UptateTaskList();

        return true;
    }

    function UptateTaskList() {
        let html = ``;

        for (let i = 0; i < TaskList.length; i++) {

            if (TaskList[i].Complete == 'true') {

                html += `<div style="background:${TaskList[i].Color};" class="Task" id="Task${TaskList[i].Order}">
                            <label class="Order Complete">${TaskList[i].Order}.</label>
                            <label class="DesTask Complete">${TaskList[i].Task}</label>
                        </div>`;

            } else {

                html += `<div style="background:${TaskList[i].Color};" class="Task" id="Task${TaskList[i].Order}">
                            <label class="Order">${TaskList[i].Order}.</label>
                            <label class="DesTask">${TaskList[i].Task}</label>
                        </div>`;

            }
        }

        $('#TaskList').html(html);

        AddEvents();
    }

    function AddEvents() {

        for (let i = 0; i < TaskList.length; i++) {
            $(`#Task${TaskList[i].Order}`).dblclick(()=>{

                $('#Order').val('');
                $('#Task').val('');
                $('#Color').val('#cccccc');

                $('#btnCreate').html('Añadir');

                sessionStorage.removeItem('TaskId');

                let msj = '';

                if (TaskList[i].Complete == 'true') {

                    TaskList[i].Complete = 'false';
                    msj = 'Tarea para completar'

                }
                else if (TaskList[i].Complete == 'false') {

                    TaskList[i].Complete = 'true';
                    msj = 'Tarea completada'  

                }
                
                $('#Notificacion').show();
                $('#Notificacion').html(`${msj}`);
                $('#Notificacion').css('background', '#00ff00');
                setTimeout(() => {
                    $('#Notificacion').hide();
                }, 2000);

                UptateTaskList();
            })

            $(`#Task${TaskList[i].Order}`).click(()=>{

                
                if (TaskList[i].Complete == 'false') {

                    $('#Order').val(TaskList[i].Order);
                    $('#Task').val(TaskList[i].Task);
                    $('#Color').val(TaskList[i].Color);

                    $('#btnCreate').html('Modificar');
                    
                    sessionStorage.setItem('TaskId',i);

                } else{

                    $('#Notificacion').show();
                    $('#Notificacion').html('Debes desmarcar para actualizar');
                    $('#Notificacion').css('background', '#0000ff');
                    $('#Notificacion').css('color', '#fff');
                    setTimeout(() => {
                        $('#Notificacion').hide();
                        $('#Notificacion').css('color', '#000');
                    }, 2000);

                }
            })
        }
    }

    function UpdateTask(Order, Task, Color) {

        if (Order === '' || Task === '') {
            $('#Notificacion').show();
            $('#Notificacion').html('Diligencia los campos requeridos');
            $('#Notificacion').css('background', '#ff0000');
            setTimeout(() => {
                $('#Notificacion').hide();
            }, 2000);
            return false;
        }

        for (let i = 0; i < TaskList.length; i++) {
            if (TaskList[i].Order == Order && TaskList[i].Order != TaskList[parseInt(sessionStorage.TaskId)].Order) {
                $('#Notificacion').show();
                $('#Notificacion').html(`Existe tarea con el orden ${Order}`);
                $('#Notificacion').css('background', '#ff0000');
                setTimeout(() => {
                    $('#Notificacion').hide();
                }, 2000);
                return false;
            }
            if (TaskList[i].Task == Task && TaskList[i].Task != TaskList[parseInt(sessionStorage.TaskId)].Task) {
                $('#Notificacion').show();
                $('#Notificacion').html(`Ya existe la tarea "${Task}"`);
                $('#Notificacion').css('background', '#ff0000');
                setTimeout(() => {
                    $('#Notificacion').hide();
                }, 2000);
                return false;
            }
        }
        
        TaskList[parseInt(sessionStorage.TaskId)] = {'Order':Order,'Task':Task,'Color':Color,'Complete':'false'};

        UptateTaskList();

        return true;
    }

    $('#btnDelete').click(()=>{
        
        if (DeleteCompletedTasks()) {
            $('#Notificacion').show();
            $('#Notificacion').html('Tareas Eliminadas con exito');
            $('#Notificacion').css('background', '#00ff00');
            setTimeout(() => {
                $('#Notificacion').hide();
            }, 2000);
        } else{
            $('#Notificacion').show();
            $('#Notificacion').html('No hay tareas para eliminar');
            $('#Notificacion').css('background', '#0000ff');            
            $('#Notificacion').css('color', '#fff');
            setTimeout(() => {
                $('#Notificacion').hide();
                $('#Notificacion').css('color', '#000');
            }, 2000);
        }

    })

    function DeleteCompletedTasks() {
        
        let newList = [];
        let cont = 0;

        for (let i = 0; i < TaskList.length; i++) {
            if (TaskList[i].Complete == 'false') {
                newList.push(TaskList[i]);
            } else{
                cont ++;
            }
        }

        if (cont === 0) {
            return false;
        }

        TaskList = newList;

        UptateTaskList();
        return true;
    }

    $('#btnClean').click(()=>{
        
        if (CleanTasks()) {
            $('#Notificacion').show();
            $('#Notificacion').html('Lista borrada correctamente');
            $('#Notificacion').css('background', '#00ff00');
            setTimeout(() => {
                $('#Notificacion').hide();
            }, 2000);
        } else{
            $('#Notificacion').show();
            $('#Notificacion').html('No hay tareas para eliminar');
            $('#Notificacion').css('background', '#0000ff');            
            $('#Notificacion').css('color', '#fff');
            setTimeout(() => {
                $('#Notificacion').hide();
                $('#Notificacion').css('color', '#000');
            }, 2000);
        }

    })

    function CleanTasks() {

        if (TaskList.length === 0) {
            return false;
        }

        TaskList = [];

        UptateTaskList();

        return true;
    }

    $('#btnSave').click(()=>{
        
        SaveTasks();

        $('#Notificacion').show();
        $('#Notificacion').html('Listado grabado con exito');
        $('#Notificacion').css('background', '#00ff00');
        setTimeout(() => {
            $('#Notificacion').hide();
        }, 2000);

    })

    function SaveTasks() {
        
        if (TaskList.length === 0) {
            localStorage.removeItem('TaskList');
        }

        localStorage.setItem('TaskList', JSON.stringify(TaskList));
        
    }

    function MostrarNotificacion(mensaje, color) {

        $('#Notificacion').show();
        $('#Notificacion').html(mensaje);
        $('#Notificacion').css('background', color);
        setTimeout(() => {
            $('#Notificacion').hide();
        }, 2000);

    }

});