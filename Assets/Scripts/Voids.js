//The player
var playerAvatar : GameObject;
//What void are you teleported to?
var connectedVoid : GameObject;
//If Roomba'd, where will this void go?
var alternateVoidPosition : Vector3;

var prefab : GameObject;
var residue : GameObject;

function Start () {
	if(connectedVoid == null)
		gameObject.renderer.material.color = Color.grey;
}

function OnTriggerEnter(other : Collider) {
	//If the player enters the void, move them to the connected void.
	if(other.tag == "Player") {
		var dir = GetRelativeLocation();
		if(dir == 1) { //left
			playerAvatar.GetComponent(Transform).position.x=connectedVoid.GetComponent(Transform).position.x+50;
			playerAvatar.GetComponent(Transform).position.z=connectedVoid.GetComponent(Transform).position.z;
		}
		if(dir == 2) { //right
			playerAvatar.GetComponent(Transform).position.x=connectedVoid.GetComponent(Transform).position.x-50;
			playerAvatar.GetComponent(Transform).position.z=connectedVoid.GetComponent(Transform).position.z;
		}
		if(dir == 3) { //bottom
			playerAvatar.GetComponent(Transform).position.x=connectedVoid.GetComponent(Transform).position.x;
			playerAvatar.GetComponent(Transform).position.z=connectedVoid.GetComponent(Transform).position.z+50;
		}
		if(dir == 4) { //top
			playerAvatar.GetComponent(Transform).position.x=connectedVoid.GetComponent(Transform).position.x;
			playerAvatar.GetComponent(Transform).position.z=connectedVoid.GetComponent(Transform).position.z-50;
		}
	}
	//If the Roomba is sucking voids, move the void and create residue
	else if (other.tag == "Roomba" && other.gameObject.GetComponent(RoombaBot).isSuckingVoids) {
		//Residue is left behind so the voids can come back when the Roomba's inverse behavior is activated
		residue = Instantiate(prefab, transform.position, Quaternion(0,0,0,0));
		residue.GetComponent(VoidResidue).originalVoid = gameObject;
		AnimateRoombaVoid(alternateVoidPosition);
	}
}

/*
Determines what direction the player is coming from when hitting the void
Returns an int based on direction
*/
function GetRelativeLocation() : int {
	var thisPos = this.transform.position;
	var charPos = playerAvatar.transform.position;
	//print ("VX:" + thisPos.x + " CX:" + charPos.x + " VZ:" + thisPos.z + " CZ:" + charPos.z);
	if( thisPos.x - 25 > charPos.x ) // left
		return 1;
	if( thisPos.x + 25 < charPos.x ) // right
		return 2;
	if( thisPos.z - 25 > charPos.z ) // bottom
		return 3;
	if( thisPos.z + 25 < charPos.z ) // top
		return 4;
}

/*
Animates the portal scaling when a RoombaBot sucks it up
*/
function AnimateRoombaVoid( newPos : Vector3) {
	var t : float = Time.time;
	while (Time.time - t < .4) {
		transform.localScale.x -= 2;
		transform.localScale.z -= 2;
		yield;
	}
	transform.position = newPos;
	while (Time.time - t > .4 && Time.time - t < .8)
	{
		transform.localScale.x += 2;
		transform.localScale.z += 2;
		yield;
	}
	transform.localScale = Vector3(50,20,50);
}