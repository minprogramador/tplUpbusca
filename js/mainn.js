
function mascaraMutuario(o,f)
{
    v_obj = o
    v_fun = f
    setTimeout('execmascara()',1)
}
 
function execmascara()
{
    v_obj.value = v_fun(v_obj.value)
}
 
function cpfCnpj(v)
{
	v=v.replace(/\D/g,"")

	if (v.length <= 14)
	{
		v = v.replace(/(\d{3})(\d)/,"$1.$2")
		v = v.replace(/(\d{3})(\d)/,"$1.$2")
		 v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2")

	}
	else
	{
		v = v.replace(/^(\d{2})(\d)/,"$1.$2")
 		v = v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3")
		v = v.replace(/\.(\d{3})(\d)/,".$1/$2")

		v=v.replace(/(\d{4})(\d)/,"$1-$2")
	}

	return v
}

function maisdados(pagina)
{
	var pag_atual   = parseInt(pagina);
	$("#PesquisaResult").hide();
	$('.load').jmspinner('large');
	
	var doc			= $('#doc').val();
	var data_res	= $("#result tbody");
	var data_pag	= $("#paginacao");
	var nome		= $('#n_nome').val();
	var cep			= $('#n_cep').val();
	var cidade		= $('#n_cidade').val();
	var uf			= $('#n_uf').val();
	var endereco 	= $('#end_logradouro').val();
	var end_numero	= $('#end_numero').val();
	var end_cep		= $('#end_cep').val();
	var end_cidade	= $('#end_cidade').val();
	var end_uf		= $('#end_uf').val();
	var telefone	= $('#n_tel').val();
	var email		= $('#fr_email').val();
	var paginas 	= parseInt($('#paginas').val());

	dados = {
		'doc': 			doc,
		'nome': 		nome,
		'cep':			cep,
		'cidade': 		cidade,
		'uf': 			uf,
		'endereco': 	endereco,
		'end_numero': 	end_numero,
		'end_cep': 		end_cep,
		'end_cidade': 	end_cidade,
		'end_uf': 		end_uf,
		'telefone': 	telefone,
		'email': 		email,
		'pagina':		pagina
	}
	
	data_res.html(" ");

	$.ajax({
		type: 'POST',
		url: './Painel',
		data: {'dados':dados},
		dataType: 'json',
		success: function(data)
		{
			var result = data['resultado'];

			var html = "";

			if(result === null)
			{
				data_res.html('');

				$('.pagnatin').hide();
				html += '<tr>';
				html += '<td colspan="5" align="center">Nada encontrado.</td>';
				html += '</tr>';
			}
			else if(result === 'href')
			{
				location.href = data['href'];
			}
			else
			{
				$("#PesquisaResult").show();

				if(result == null)
				{
					data_res.html('');
					$('.pagnatin').hide();
					html += '<tr>';
					html += '<td colspan="5" align="center">Nada encontrado.</td>';
					html += '</tr>';
				}
				else if(result === 'msg')
				{
					data_res.html('');

					$('.pagnatin').hide();
					html += '<tr>';
					html += '<td colspan="5" align="center">'+ data['msg'] +'</td>';
					html += '</tr>';
				}
				else
				{
					for (i = 0; i < result.length; i++)
					{
						doc   = result[i]['doc'];
						html += '<tr>';
						html += '<td><a href="./Dados/'+ result[i]['id'] +'">' + doc + '</a></td>';
						html += '<td>' + result[i]['nome'] + '</td>';					
						html += '<td>' + result[i]['idade'] + '</td>';
						html += '<td>' + result[i]['cidade'] + '</td>';
						html += '<td>' + result[i]['uf'] + '</td>';
						html += '</tr>';
					}

					html_pg = '';
					var anterior =  pagina - 1;

					if(pagina === 1)
					{
						html_pg += '<li class="disabled"><a href="javascript:void(0)"><span class="glyphicon glyphicon-chevron-left"></span></a></li>';					
					}
					else
					{
						html_pg += '<li><a href="javascript:void(0)" onclick="javascript:maisdados('+ anterior +')"><span class="glyphicon glyphicon-chevron-left"></span></a></li>';
					}

					if(paginas === 1)
					{
						$('.pagnatin').hide();
					}
					else
					{
						for (i = 1; i <= paginas; i++)
						{
							if(i === pag_atual)
							{
								html_pg += '<li class="active"><a href="javascript:void(0)">'+ i +'</a></li>';							
							}
							else
							{
								html_pg += '<li><a href="javascript:void(0)" onclick="javascript:maisdados('+i+')" class="maisdados" id="'+i+'">'+ i +'</a></li>';														
							}
						}
						var proxima = pag_atual + 1;

						if(pagina === paginas)
						{
							html_pg += '<li class="disabled"><a href="javascript:void(0)"><span class="glyphicon glyphicon-chevron-right"></span></a></li>';					
						}
						else
						{
							html_pg += '<li><a href="javascript:void(0)" onclick="javascript:maisdados('+ proxima +')"><span class="glyphicon glyphicon-chevron-right"></span></a></li>';
						}

						$('.pagnatin').show();
					}
				}
			}

			$('.load').jmspinner(false);
			data_res.html(html);
			data_pag.html(html_pg);
		}
	});	
}

$(document).ready(function()
{
	$(function(){ $( "#dialog" ).dialog(); });

	$(".bntmenu").click(function()
	{
		$("#consultardados")[0].reset();
		$("#PesquisaResult").hide();
	});

	$("#btAtualizarSenha").click(function()
	{
		var senha		 = $('#senha').val();
		var nova_senha	 = $("#nova_senha").val();
		var c_nova_senha = $("#c_nova_senha").val();

		dados = {
			'senha': senha,
			'nova_senha': nova_senha,
			'c_nova_senha': c_nova_senha
		}

		$.ajax({
			type: 'POST',
			url: './Painel',
			data: {'altsenha':dados},
			dataType: 'json',
			success: function(data)
			{
				alert(data.msg);
				if(data.error == false)
				{
					$('#EditrarCadastro').modal('hide');
				}
			}
		});
	});

	$("#bntContato").click(function()
	{
		var assunto   = $('#assunto').val();
		var mensagem  = $("#mensagem").val();

		dados = {
			'assunto': assunto,
			'mensagem': mensagem
		}

		$.ajax({
			type: 'POST',
			url: './Painel',
			data: {'contato':dados},
			dataType: 'json',
			success: function(data)
			{
				alert(data.msg);
				if(data.error == false)
				{
					$('#Contato').modal('hide');
				}
			}
		});
	});

	$("#bntpai").click(function(){
		var doc			= $('#doc').val();
		var data_res	= $("#resultpPlus");
		data_res.html("Aguarde...");

		dados = {
			'doc':   	doc,
			'consulta':	'pai'
		}

		$.ajax({
			type: 'POST',
			url: '../Painel',
			data: {'dados':dados},
			dataType: 'html',
			success: function(data)
			{
				data_res.html(data);
			}
		});
	});

	$("#bntrg").click(function(){
		var doc			= $('#doc').val();
		var data_res	= $("#resultrPlus");
		data_res.html("");
		data_res.html("Aguarde...");

		dados = {
			'doc':   	doc,
			'consulta':	'rg'
		}

		$.ajax({
			type: 'POST',
			url: '../Painel',
			data: {'dados':dados},
			dataType: 'html',
			success: function(data)
			{
				data_res.html(data);
			}
		});
	});	

	$("#bntcnh").click(function(){
		var doc			= $('#doc').val();
		var data_res	= $("#resultcPlus");
		data_res.html("");
		data_res.html("Aguarde...");

		dados = {
			'doc':   	doc,
			'consulta':	'cnh'
		}

		$.ajax({
			type: 'POST',
			url: '../Painel',
			data: {'dados':dados},
			dataType: 'html',
			success: function(data)
			{
				data_res.html(data);
			}
		});
	});	

	$("#bntcredito").click(function(){
		var doc			= $('#doc').val();
		var data_res	= $("#resultsPlus");
		var data_resok	= $("#resultcredito");
		data_resok.html("");
		data_res.html("");
		data_res.html("Aguarde...");

		dados = {
			'doc':   	doc,
			'consulta':	'credito'
		}

		$.ajax({
			type: 'POST',
			url: '../Painel',
			data: {'dados':dados},
			dataType: 'html',
			success: function(data)
			{
				data_res.html("");
				data_resok.html(data);
				$('#resultcredito').show();
			}
		});
	});	

	$(".pesquisar").click(function()
	{
		var pag_atual   = 1;
		$('#paginas').val("");
		$("#PesquisaResult").hide();
		$('.load').jmspinner('large');
		var doc			= $('#doc').val();
		var data_res	= $("#result tbody");
		var data_pag	= $("#paginacao");
		var nome		= $('#n_nome').val();
		var cep			= $('#n_cep').val();
		var cidade		= $('#n_cidade').val();
		var uf			= $('#n_uf').val();
		var endereco 	= $('#end_logradouro').val();
		var end_numero	= $('#end_numero').val();
		var end_cep		= $('#end_cep').val();
		var end_cidade	= $('#end_cidade').val();
		var end_uf		= $('#end_uf').val();
		var telefone	= $('#n_tel').val();
		var email		= $('#fr_email').val();

		dados = {
			'doc': 			doc,
			'nome': 		nome,
			'cep':			cep,
			'cidade': 		cidade,
			'uf': 			uf,
			'endereco': 	endereco,
			'end_numero': 	end_numero,
			'end_cep': 		end_cep,
			'end_cidade': 	end_cidade,
			'end_uf': 		end_uf,
			'telefone': 	telefone,
			'email': 		email
		}
		
		data_res.html("");

		$.ajax({
			type: 'POST',
			url: './Painel',
			data: {'dados':dados},
			dataType: 'json',
			success: function(data)
			{
				$("#PesquisaResult").hide();
				$('.load').jmspinner('large');				
				
				var result = data['resultado'];
				
				$('#paginas').val(data['paginas']);
				
				var html = "";

				if(result === null)
				{
					$('.load').jmspinner(false);
					$("#PesquisaResult").show();					
					data_res.html('');

					$('.pagnatin').hide();
					html += '<tr>';
					html += '<td colspan="5" align="center">Nada encontrado.</td>';
					html += '</tr>';
				}
				else if(result === 'msg')
				{
					$('.load').jmspinner(false);
					$("#PesquisaResult").show();					
					data_res.html('');
					$('.pagnatin').hide();
					html += '<tr>';
					html += '<td colspan="5" align="center">'+ data['msg'] +'</td>';
					html += '</tr>';
				}
				else if(result === 'href')
				{
					location.href = data['href'];
				}
				else
				{
					$('.load').jmspinner(false);
					$("#PesquisaResult").show();

					for (i = 0; i < result.length; i++)
					{
						doc = result[i]['doc'];
						html += '<tr>';
						html += '<td><a href="./Dados/'+ result[i]['id'] +'">' + doc + '</a></td>';
						html += '<td>' + result[i]['nome'] + '</td>';
						html += '<td>' + result[i]['idade'] + '</td>';
						html += '<td>' + result[i]['cidade'] + '</td>';
						html += '<td>' + result[i]['uf'] + '</td>';
						html += '</tr>';
					}
					
					html_pg = '';
					html_pg += '<li class="disabled"><a href="#"><span class="glyphicon glyphicon-chevron-left"></span></a></li>';

					if(parseInt(data['paginas']) === 1)
					{
						$('.pagnatin').hide();
					}
					else
					{
						$('.pagnatin').show();
							
						data['paginas'] =  data['paginas'] + 1;

						for (i = 1; i < data['paginas']; i++)
						{
							if(i == pag_atual)
							{
								html_pg += '<li class="active"><a href="javascript:void(0)">'+ i +'</a></li>';							
							}
							else
							{
								html_pg += '<li><a href="javascript:void(0)" onclick="javascript:maisdados('+i+')" class="maisdados" id="'+i+'">'+ i +'</a></li>';														
							}
						}
						var proxima = pag_atual + 1;
						html_pg += '<li><a href="javascript:void(0)" onclick="javascript:maisdados('+ proxima +')"><span class="glyphicon glyphicon-chevron-right"></span></a></li>';
					}						
				}

				data_res.html(html);
				data_pag.html(html_pg);
			}
		});		
	});


	$("#nova_consulta").click(function(){
		location.href = "../Painel";
	});

	$("#n_tel").click(function(){
		jQuery("#n_tel").mask("(99) 9999-9999?9");
	});

});