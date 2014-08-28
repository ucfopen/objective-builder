//Logic to Build Objective

//Master list of objectives
var objectiveList = [];
//The index of the current objective within objective list
var current_index = 0;
//create initial objective object and push it onto the stack
var current_objective = new Objective();

objectiveList.push(current_objective);
//lis that contains all verbs from JSON file
var verblist;
//Function to enable sliding via bottom bar
var active_slide = 1;
//Total number of sections in the document
var total_slides = $("section").length;

//Function that handles bottom bar navigation
$(document).on("click", "#bottom_bar button", function() {
	//Get index of slide
    var id = $(this).val();
    //remove active class
    $("#slide_" + active_slide).removeClass("active");
    
    active_slide = id;
    
    $("#slide_" + id).addClass("active");
});

//Function that links colored text from the objective to appropriate pages within the application
$("#objword").on("click", "#bottom_bar p span", function() {
	//Get index of slide
    var slide = $(this).attr('value');
    console.log(slide);
    //remove active class
    if(slide == 3){
    	$("#slide_" + slide).removeClass("active");
    	$("#slide_" + slide).addClass("active");	
    }
    else if (slide == 4){
    	$("#slide_" + slide).addClass("active");
    	$("#slide_" + slide).removeClass("active");
    }
    else if (slide == 5){
    	$("#slide_" + slide).addClass("active");
    	$("#slide_" + slide).removeClass("active");
    }

});

//Function to enable navigation between slides for next button
$(".next-button").on("click", function(e){
	e.preventDefault();

	//Prevents from going beyond num of total slides
	if(active_slide <= total_slides){
		$("#slide_" + active_slide).removeClass("active");
		console.log(active_slide);
		console.log("before");
		active_slide = parseInt(active_slide) + 1;
		console.log(active_slide);
		console.log("after");
		$("#slide_" + active_slide).addClass("active");
	}
	console.log(active_slide);
});

$(".prev-button").on("click", function(e){
	e.preventDefault();

	if(active_slide > 1){
		$("#slide_" + active_slide).removeClass("active");
		active_slide = active_slide - 1;
		$("#slide_" + active_slide).addClass("active");
	}
	console.log(active_slide);
});
$("#home").on("click",function(e){
	e.preventDefault();

	$("#slide_" + active_slide).removeClass("active");
	active_slide = 1;
	$("#slide_" + active_slide).addClass("active");
	console.log(active_slide);
});
//Hide the bottom bar on load
$("#hide").show();
$("#example_hide").hide();
$("#bottom_bar").hide();

//Show the bottom bar when advancing to the next slide
$("#begin_next").on("click", function(){
	$("#bottom_bar").show();
	$("#hide").hide();
	//$("#example_hide").show();
});
$("#example_next").on("click",function(){
	$("#example_hide").hide();
});

//Objective object constructor
function Objective(audience, domain, level, verb, tool, condition, degree) {
	this.audience = audience;
	this.domain = domain;
	this.level = level;
	this.verb = verb;
	this.tool = tool;
	this.condition = condition;
	this.degree = degree;
}

function updateVerbs() {
	var domain = $("#domain").val() ;
	var level = $("#level").val();
	var verb_select = document.getElementById("verb");
	// Clear verb list
	for(var index in verb_select) {
		verb_select.remove(index);
	}
	// If level IS NOT specified, disable verb select box
	if (level == ''){
		$(verb_select).prop('disabled', true);
	}
	// If level IS specified, enable and populate verb select box
	else if (domain == ''){
		$(verb_select).prop('disabled', true);
	}
	else{
		$(verb_select).prop('disabled', false);
		// Initial blank option
		verb_select.options[verb_select.options.length] = new Option("", "");
		// Fill in based on the information it is given
		for(var verbIndex in verblist[domain][level]["verbs"]) {
			var verb = verblist[domain][level]["verbs"][verbIndex];
			verb_select.options[verb_select.options.length] = new Option(verb.substr(0, 1).toUpperCase() + verb.substr(1), verb);
		}
	}
}

function updateLevel(){
	var domain = $("#domain").val();
	var level_select = document.getElementById("level");
	var verb_select = document.getElementById("verb");
	// Clear level list
	for (var index in level_select) {
		level_select.remove(index);
	}
	// Clear verb list
	for (var index in verb_select){
		verb_select.remove(index);
	}
	// If domain IS NOT specified, disable level and verb select boxes
	if (domain == ''){
		$(level_select).prop('disabled', true);
		$(verb_select).prop('disabled', true);
	}
	// If domain IS specified, enable and populate level select box
	else {
		$(level_select).prop('disabled', false);
		// Initial blank option
		level_select.options[level_select.options.length] = new Option("", "");
		// Populate level select box based on domain
		for (var level in verblist[domain]) {
			level_select.options[level_select.options.length] = new Option(level, level);
		}
	}
}

// Get the JSON file
$.get('verbs.json', function(verb_obj) {

	//input selectors
	var domain_select = document.getElementById("domain");
	var level_select = document.getElementById("level");
	var verb_select = document.getElementById("verb");

	//populating the object with verbs
	verblist = verb_obj;

	// Disable level and verb select boxes by default
	$(level_select).prop('disabled', true);
	$(verb_select).prop('disabled', true);
	
	// Initial blank option
	domain_select.options[domain_select.options.length] = new Option("", "");
	// Populate domain select boxes
	for (var domain in verb_obj) {
		domain_select.options[domain_select.options.length] = new Option(domain, domain);
	}

	// When domain box value is changed...
	$("#domain").on("change", updateLevel);

	// When level box value is changed...

	$(level_select).on("change", function(){ updateVerbs(); getDefinitions(); });
});

//This part of the code deals with taking the input from the user and dropping it in the finished product box
$(".user_input").on("change keyup", function() {
	//update current objective object
	current_objective.audience = $("#audience_text").val();
	current_objective.domain = $("#domain").val();
	current_objective.level = $("#level").val();
	current_objective.tool = $("#tool_input").val();
	var verb = $("#verb").val();
	if (verb != null) {
		current_objective.verb = verb;
	}
	else {
		current_objective.verb = "";
	}
	current_objective.tool = $("#tool_input").val();
	current_objective.condition = $("#condition_text").val();
	current_objective.degree = $("#degree_text").val();

	//update objective bar
	updateObjectiveBar();

	$('#0').show();

	// update completed box
	$("#compList #"+current_index+" p.finCon").html(
		"Given "
		+ current_objective.condition
		+ ", "
		+ current_objective.audience
		+ " will "
		+ current_objective.verb
		+ " "
		+ current_objective.tool
		+ " "
		+ current_objective.degree
		+"."
	);
});

//Function that links bottom bar buttons to appropriate pages
$("#bottom_bar div, #objective span").each(function(){
	$(this).on("click", function(e) {
		$("[data-slidesjs-item=" + $(this).attr("slideid") + "]").click();
	});
});

function updateFields(){
	//Function to set all inputs.
	$("#audience_text").val(current_objective.audience);
	$("#domain").val(current_objective.domain);
	updateLevel();
	$("#level").val(current_objective.level);
	updateVerbs();
	$("#verb").val(current_objective.verb);
	$("#tool_input").val(current_objective.tool);
	$("#condition_text").val(current_objective.condition);
	$("#degree_text").val(current_objective.degree);
}

function updateObjectiveBar(){
	$("#objective_audience").text(current_objective.audience);
	if(current_objective.verb != null) {
		$("#objective_behavior").text(current_objective.verb + " " + current_objective.tool);
	}
	else {
		$("#objective_behavior").text(current_objective.tool);
	}
	$("#objective_condition").text(current_objective.condition);
	$("#objective_degree").text(current_objective.degree);
}

//Function to delete an objective
$(document.body).on("click", ".delete", function(e){
	e.preventDefault();

	console.log(objectiveList);
	$(this).parents("li")[0].remove();
	if($(this).parents("li")[0].id > -1){
		objectiveList.splice($(this).parents("li")[0].id, 1);
	}
	console.log(objectiveList);
	//Update fields
	updateFields();

	//Update preview
	updateObjectiveBar();
	$("#objective_audience").empty();
	$("#objective_behavior").empty();
	$("#objective_condition").empty();
	$("#objective_degree").empty();
});

$(document.body).on("click", ".edit", function(e) {
	e.preventDefault();

	//update current_index
	current_index = $(this).parents("li")[0].id;

	//Link back to the condition page
	$("#slide_" + active_slide).removeClass("active");
	active_slide = 3;
	$("#slide_" + active_slide).addClass("active");
	console.log(active_slide);

	//load objective into current_objective
	console.log(objectiveList);
	console.log(current_index);
	current_objective = objectiveList[current_index];
	console.log(objectiveList);
	console.log(current_index);
	//update fields
	updateFields();

	//update preview
	updateObjectiveBar();
});


$("#add").on("click", function() {
	//Link you back to condition page
	$("#slide_" + active_slide).removeClass("active");
	active_slide = 3;
	$("#slide_" + active_slide).addClass("active");
	console.log(active_slide);
	//Create new, blank objective
	current_objective = new Objective();
	objectiveList.push(current_objective);
	current_index = objectiveList.length - 1;

	

	//reset bottom bar
	$("#objective_audience").empty();
	$("#objective_behavior").empty();
	$("#objective_condition").empty();
	$("#objective_degree").empty();
	//Code that appends the new object to the list
	$("#compList").append(
		"<li id='"
		+ current_index
		+ "'><p class='finCon'>Given , will .</p><div class='objButtons'><a href='#' class='edit'><img src='pencil.png' alt='edit' title='edit' class='pencil'></a><a href='#' class='delete'><img src='close.png' alt='delete' title='delete' class='close'></a></div></li>");

	updateFields();
	hideAllInfoBoxes();
});
//Building a lightbox

$('#download').ready(function(){
	$(".black_overlay").hide();
	$("#finished_objective_text").hide();
	$("#txtfile").hide();
});

$("#download_button").on("click", function(){
	$(".black_overlay").show();
	$("#finished_objective_text").show();
	$("#txtfile").show();
	$("#txtfile").val("");
	$("#compList li p").each(function(){
		$("#txtfile").val($("#txtfile").val() + $(this).text() +"\n");
	});
});

$(".black_overlay").on("click", function(){
	$(".black_overlay").hide();
	$("#finished_objective_text").hide();
	hideAllInfoBoxes();
});

//Lightbox for behavior information

function hideAllInfoBoxes(){
	$(".black_overlay").hide();
	$("#domain_help_content").hide();
	$("#level_help_content").hide();
	$("#verb_help_content").hide();
	$("#tool_help_content").hide();
	//$("#level_definition").hide();
	//$("#0").hide();
}

//When the behavior page loads execute this
$("#behavior").ready(function(){
	//Hide the black overlay and white content on load 
	hideAllInfoBoxes();
	$("#info_pic1").on("click",function(){
		$(".black_overlay").show();
		$("#domain_help_content").show();
		$("#domain_help").show();
	});
	$("#info_pic2").on("click",function(){
		$(".black_overlay").show();
		$("#level_help_content").show();
		$("#level_help").show();
	});
	$("#info_pic4").on("click",function(){
		$(".black_overlay").show();
		$("#tool_help_content").show();
		$("#tool_help").show();
	});
	$("#level").on("click",function(){
		$("#level_definition").show();
	});

});

 var definition;
 var example;
function getDefinitions(){
	var level_def;
	$.getJSON("verbs.json", function(data){
		console.log(data);
		var index1;
		var index2;
		index1 = $("#domain").val();
		index2 = $("#level").val();
		console.log(data[index1][index2]);
		definition = data[index1][index2]["definition"];
		example = data[index1][index2]["example"];
		var def = document.getElementById("definition");
		var exp = document.getElementById("level_example");
		def.innerHTML= definition;
		exp.innerHTML = example;

	})
}