#pragma strict

class RoombaBot extends AnthroBot
{
	var isSuckingVoids : boolean;
	
	/*
	Sets the texture to on/off depending on behavior
	*/
	function SetTexture() {
		if(isSuckingVoids)
			renderer.material.mainTexture = onTexture;
		else
			renderer.material.mainTexture = offTexture;
	}
	
	//Swap between normal and inverse behavior
	function Swap() {
		isSuckingVoids = !isSuckingVoids;
		SetTexture();
	}
}