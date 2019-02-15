# rule

FirebaseのFireStoreのセキュリティルールを置いておきます。

## posts

```js
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    function isValidPost(data) {
  		return true
      	&& request.auth.uid != null
      	&& data.size() == 3
      	&& data.subject != null
      	&& data.subject.size() < 200
        && data.userId == request.auth.uid
        && data.body != null
        && data.body.size() > 0
        && data.body.size() < 262144
        ;
    }
    function isOwner() {
    	return request.auth.uid == resource.data.userId;
    }
    function isOwnerAndValidPost() {
    	return isOwner() && isValidPost();
    }
    match /posts/{post} {
    	allow read: if true;
    	allow create: if isValidPost(request.resource.data);
      allow update: if isOwnerAndValidPost();
      allow delete: if isOwner();
    }
  }
}
```
