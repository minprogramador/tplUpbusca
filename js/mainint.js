
$(document).ready(function()
{
	$("#bnt_fechar_user").click(function(){
		$("#frm_cad_user")[0].reset();
	});

    $("#bnt_save_user").click(function()
    {
		var nome    = $('#nome_completo').val();
		var email   = $('#email').val();
		var usuario = $('#usuario').val();		
		var senha   = $('#senha').val();
		var periodo = $('#periodo').val();

        var control_listagem      = $('#control_listagem').val();
		var control_dados_basicos = $('#control_dados_basicos').val();
		var control_pai           = $('#control_pai').val();
		var control_rg            = $('#control_rg').val();
		var control_inss          = $('#control_inss').val();

        var controles = new Array();
        $("input[name='control[]']:checked").each(function ()
        {
            controles.push( $(this).val());
        });

		dados = {
			'nome':     nome,
			'email':    email,
			'usuario':  usuario,
			'senha':    senha,
			'periodo':  periodo,
			'controle': controles
		}

		$.ajax({
			type: 'POST',
			url: './Usuarios.php',
			data: {'dados':dados},
			dataType: 'html',
			success: function(data)
			{
				data_res.html(data);
			}
		});
    });
    
});