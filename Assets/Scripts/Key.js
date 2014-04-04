#pragma strict
var door : GameObject;

function OnTriggerEnter (col : Collider) {
	Destroy(gameObject);
	door.GetComponent(Animation)["open"].speed = 1.0;
	door.GetComponent(Animation).Play("open");
	door.GetComponent(BoxCollider).isTrigger=true;
}