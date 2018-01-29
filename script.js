 $(function (jQuery) {

	//array of objects to contain multiple properties of the same name, 2 for each taxband

	(function stampDutyCalculator() {

		var taxbands = [{
				min: 0,
				max: 125000,
				percent: 0
			},
			{
				min: 125000,
				max: 250000,
				percent: 0.02
			},
			{
				min: 250000,
				max: 925000,
				percent: 0.05
			},
			{
				min: 925000,
				max: 1500000,
				percent: 0.1
			},
			{
				min: 1500000,
				max: null,
				percent: 0.12
			}
		];

		var secondTaxbands = [{
				min: 0,
				max: 125000,
				percent: 0.03
			},
			{
				min: 125000,
				max: 250000,
				percent: 0.05
			},
			{
				min: 250000,
				max: 925000,
				percent: 0.08
			},
			{
				min: 925000,
				max: 1500000,
				percent: 0.13
			},
			{
				min: 1500000,
				max: null,
				percent: 0.15
			}
		];

		//row template to add to table, tags replaced with content
		var tableRow = "<tr><td>{taxband}</td><td>{percent}</td><td>{taxable}</td><td class='tax'>{TAX}</td></tr>",
			table = $("#taxband-table"),
			results = $("#results"),
			resultsSection = $('#results-section'),
			input = $("#value"),
			checkBox = $('#isSecondHome'),
			// resetBtn = $('#reset'),
			errorMsg = $('#error'),
			effectiveRate = $("#effective-rate");

		$('#calculate').on('click', function calculateButton() {
			//only run function if something is entered 
			if (input.val() !== '') {
				resultsSection.fadeIn();
				calculateStampDuty();
			} else {
				errorMsg.fadeIn();
			}
		});

		checkBox.on('click', function checked() {
			calculateStampDuty();
		});

		// resetBtn.on('click', function reset() {
		// 	resultsSection.add(errorMsg).fadeOut();
		// 	//clears all values in input field 
		// 	input.val('');
		// });
		
		function calculateStampDuty() {

			var bands = taxbands,
				//removes commas
				input2 = input.val().replace(/[,]/g, ""),
				//grabs value of input field and parses it as a number
				userInput = parseInt(input2, 10),
				row;

			//if the value of input is not a number fade out results and fade in error message
			if (!$.isNumeric(input2)) {
				resultsSection.css('display', 'none');
				errorMsg.fadeIn();
				//keeps value within statement
				return;
			}
			//if checkbox is selected change value of bands variable
			if (checkBox.is(':checked')) {
				bands = secondTaxbands;
			}
			//prevents tables being printed multiple times
			if (table.length) {
				//gets all rows higher than row 1 and removes 
				table.find("tr:gt(0)").remove();
			}
			//CALCULATION FUNCTIONS//

			//function expression to calculate taxable sum, takes 2 parameters
			var taxableSum = function (max, min) {
					//shorthand if statement 
					var maxBand = (max !== null) ? Math.min(max, userInput) : maxBand = userInput;
					//returns 0 if any negative numbers are found
					return Math.max(0, maxBand - min);
				},
				//takes taxablesum function as parameater to calculate overall tax
				TAX = function (taxablesum, percent) {
					//returns string to 2 decimal places (toFixed returns a string)
					return (taxablesum * percent).toFixed(2);
				},
				effectiverate = function (tax) {
					eRate = tax / userInput * 100;
					return eRate.toFixed(1);
				},
				//function to add commas between numbers
				numberWithCommas = function (x) {
					var parts = x.toString().split(".");
					parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					return parts.join(".");
				},
				totalTax = 0.00,
				eRate;

			//BEGIN LOOP//
			
			//for loop to loop through array of objects 
			for (var i = 0; i < bands.length; i++) {
				//variables to be used as arguments in functions above, not best practice to declare functions in loop
				var min = bands[i].min,
					max = bands[i].max,
					pct = bands[i].percent,
					taxablesum = taxableSum(max, min),
					tax = TAX(taxablesum, pct);

				//replaces template tags with min, max and percent values in object
				if (max !== null) {
					row = tableRow.replace("{taxband}", "£" + min + " - " + "£" + max).replace("{percent}", (pct * 100) + "%");
				} else {
					//used for last taxband
					row = tableRow.replace("{taxband}", "£" + min + "+").replace("{percent}", (pct * 100) + "%");
				}

				if (userInput > 125000) {
					row = row.replace("{taxable}", "£" + numberWithCommas(taxablesum)).replace("{TAX}", "£" + numberWithCommas(tax));
				} else {
					row = row.replace("{taxable}", "£" + numberWithCommas(taxablesum)).replace("{TAX}", "£" + numberWithCommas(tax));
				}

				//adds built rows to table
				table.append(row);

				//sums values of tax bands and converts to a number
				totalTax += Number(tax);
			}

			eRate = effectiverate(totalTax);
			//adds values to html as text
			results.text('£' + numberWithCommas(totalTax));
			effectiveRate.text(eRate + '%');
		}
	}());
 });