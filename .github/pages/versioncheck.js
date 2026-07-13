// ##############################################################################################
// vBulletin Version Checker
// Author: Kier Darby
// CVS: $RCSfile$ - $Revision: 5493 $

// ##############################################################################################
// takes a version number like 'Intlver 3.0.0 Beta 4' and splits into an array of integers for comparison
function getVersionArray(version)
{
	// initialize variables
	var subVerCheck, mainVer, subVer, versionBits, i;

	// check if we have a subversion (x.y.z Beta 1 etc.)
	if (subVerCheck = version.match(/^([a-zA-Z]+ )?([0-9\.]+)\s*([a-zA-Z].*)$/))
	{
		mainVer = subVerCheck[2];
		subVer = subVerCheck[3].toUpperCase();
	}
	else
	{
		// there is no sub-version
		mainVer = version;
		subVer = "";
	}

	// split the main version by periods
	versionBits = mainVer.split(".");

	// if the main version number does not have 4 components, create the missing ones as zeroes
	if (versionBits.length < 4)
	{
		for (i = versionBits.length; i < 4; i++)
		{
			versionBits[i] = 0;
		}
	}

	// add default subversion numbers
	versionBits[4] = 0;
	versionBits[5] = 0;

	// check if we have a sub-version
	if (subVer != "")
	{
		// attempt to match the sub-version string
		if (matches = subVer.match(/^(A|ALPHA|B|BETA|G|GAMMA|RC|RELEASE CANDIDATE|GOLD|STABLE|FINAL|PL|PATCH LEVEL|PATCH)\s*(\d*)$/i))
		{
			// check the value of the sub-version type (beta/rc etc.)
			switch(matches[1])
			{
				// alpha: set the value to -4
				case "A":
				case "ALPHA":
					versionBits[4] = -4;
					break;

				// beta: set the value to -3
				case "B":
				case "BETA":
					versionBits[4] = -3;
					break;

				// gamma: set the value to -2
				case "G":
				case "GAMMA":
					versionBits[4] = -2;
					break;

				// release candidate: set the value to -1
				case "RC":
				case "RELEASE CANDIDATE":
					versionBits[4] = -1;
					break;

				// patch version: set value to 1
				case "PL":
				case "PATCH LEVEL":
				case "PATCH":
					versionBits[4] = 1;
					break;

				// something else: set the value to 0
				case "GOLD":
				case "STABLE":
				case "FINAL":
				default:
					versionBits[4] = 0;
			}

			// add the matches to the versionBits array
			versionBits[5] = matches[2];
		}
	}

	// ensure that each element of the versionBits array is an integer
	for (i = 0; i < 6; i++)
	{
		if (!(versionBits[i] = parseInt(versionBits[i])))
		{
			versionBits[i] = 0;
		}
	}

	// return the completed array
	return versionBits;
}

// ##############################################################################################
// compares the array of integers from two version numbers to see if one is newer than the other
function isNewerVersion(thisVersion, latestVersion)
{
	// initialize variables
	var curVersion, newVersion, i;

	// are the version numbers different?
	if (thisVersion != latestVersion)
	{
		// get arrays from the version numbers
		curVersion = getVersionArray(thisVersion);
		newVersion = getVersionArray(latestVersion);

		// check each element of the arrays against each other
		for (i = 0; i < 6; i++)
		{
			// is the 'new' value the same as the 'current' value?
			if (newVersion[i] != curVersion[i])
			{
				// values are not the same - return true if greater, false if lesser
				return (newVersion[i] > curVersion[i]);
			}
		}
	}

	return false;
}
