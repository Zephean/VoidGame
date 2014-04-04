#pragma strict

var connectedToNextLevel : boolean;

function OnTriggerEnter(col:Collider) {
	if(col.gameObject.tag == "Player" && connectedToNextLevel)
		Application.LoadLevel(Application.loadedLevel+1);
}