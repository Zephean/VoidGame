#pragma strict
var originalVoid : GameObject;

function OnTriggerEnter(other : Collider) {
	//If the Roomba is set to inverse behavior, put the void back and destroy the residue.
	if (other.tag == "Roomba" && !other.GetComponent(RoombaBot).isSuckingVoids) {
		originalVoid.GetComponent(Voids).AnimateRoombaVoid(transform.position);
		Destroy(this);
	}
}