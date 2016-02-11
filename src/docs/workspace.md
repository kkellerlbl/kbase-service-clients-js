# Workpace API

The Workspace Service (WSS) is primarily a language independent remote storage
and retrieval system for KBase typed objects (TO) defined with the KBase
Interface Description Language (KIDL). It has the following primary features:

- Immutable storage of TOs with
    - user defined metadata 
    - data provenance
- Versioning of TOs
- Referencing from TO to TO
- Typechecking of all saved objects against a KIDL specification
- Collecting typed objects into a workspace
- Sharing workspaces with specific KBase users or the world
- Freezing and publishing workspaces

Size limits:

- TOs are limited to 1GB
- TO subdata is limited to 15MB
- TO provenance is limited to 1MB
- User provided metadata for workspaces and objects is limited to 16kB

> NOTE ON BINARY DATA:
> 
> All binary data must be hex encoded prior to storage in a workspace. 
> Attempting to send binary data via a workspace client will cause errors.

## Types

### <a name="WorkspaceIdentity"></a>WorkspaceIdentity

A workspace identifier.

Select a workspace by one, and only one, of the numerical id or name, where the name can also be a KBase ID including the numerical id, e.g. ```kb|ws.35```.

An object with the following structure:

id
: the numerical ID of the workspace

workspace
: name of the workspace or the workspace ID in KBase format, e.g. kb|ws.78.
    
#### Example

These are valid workspace identities:

```javascript
var workspaceId = {
  id: 123
};
var workspaceId = {
  workspace: 'my_workspace'
};
```

But these are invalid:

```javascript
var workspaceId = {
  id: 123,
  workpace: 'my_workspace'
};
```

### workspace_info

An array containing information about a given workspace. 

0. _id_ {ws_id} - the numerical ID of the workspace
1. _workspace_ {ws_name} - name of the workspace
2. _owner_ {username}  - name of the user who owns (e.g. created) this workspace.
3. _moddate_ {timestamp}  - date when the workspace was last modified.
4. _objects_ {int} - the approximate number of objects currently stored in the workspace.
5. _user_permission_ {permission} - permissions for the authenticated user of this workspace.
6. _globalread_ {permission} - whether this workspace is globally readable.
7. _lockstat_ {lock_status}  - the status of the workspace lock.
8. _metadata_ {usermeta} - arbitrary user-supplied metadata about the workspace.

### obj_ref

An Object Reference is a string which may be used to uniquely identify an object within the workspace service, across all workspaces. It is formatted in a specific way, as specified below, so as to contain the workspace and object identifiers, and optionally the version. If the version is not specified, it identifies the most recent version at the moment it is used with a workspace method.

There are two forms of an object reference:

```
[ws_name or id]/[obj_name or id]/[obj_ver]
```

for example, 

- ```MyFirstWorkspace/MyFirstObject/3``` would identify the third version of an object called ```MyFirstObject``` in the workspace called ```MyFirstWorkspace```,
- ```42/Panic/1``` would identify the first version of the object name ```Panic``` in workspace with id ```42```, and
- ```Towel/1/6``` would identify the 6th version of the object with id ```1``` in the ```Towel``` workspace. 

```
kb|ws.[ws_id].obj.[obj_id].ver.[obj_ver]
```

for example, 

- ```kb|ws.23.obj.567.ver.2``` would identify the second version of an object with id ```567``` in a workspace with id ```23```.

In all cases, if the version number is omitted, the latest version of the object is assumed.

### ObjectIdentity

An object identifier.
		
Select an object by identifying both the workspace and object, either of which may be the numerical id or the string name of, and optionally the object version number. If the version is not provided, the latest version of the object will be assumed.

They may be mixed. Although at any given moment, an identifier may be valid in any configuration, across time the only stable identifier uses numeric components. This is because a user may change either the workspace or object name at any time.

The structure is an object:

workspace {ws_name}
: The string name of the workspace

wsid {wd_id}
: The numerical identifier of the workspace

name {obj_name}
: The string name of the workspace

objid {ws_id}
: The numeric identifier of the object

ver {obj_ver}
: The numeric version identifier of the object

ref {obj_rev}
: A string reference to the object



### Workspace identifier

- numerical id of the workspace
- or name of the workspace, where the name can also be a KBase ID including the numerical id,

```
e.g. kb|ws.35.
        ws_id wsid - the numerical ID of the workspace.
        ws_name workspace - name of the workspace or the workspace ID
                in KBase format, e.g. kb|ws.78.
```

AND 
One, and only one, of the numerical id or name of the object.
        obj_id objid- the numerical ID of the object.
        obj_name name - name of the object.
OPTIONALLY
        obj_ver ver - the version of the object.
OR an object reference string:
obj_ref ref - an object reference string.

typedef structure {
		ws_name workspace;
		ws_id wsid;
		obj_name name;
		obj_id objid;
		obj_ver ver;
		obj_ref ref;
	} ObjectIdentity;


### object_info

### GetObjectInfoNew

Input parameters for the "get_object_info_new" function.
	
objects {array of ObjectIdentity}
: the objects for which the information should be fetched

includeMetadata {boolean} [false]
: include the object metadata in the returned information. Default false.

ignoreErrors {boolean} [false]
: Don't throw an exception if an object cannot be accessed; return null for that object's information instead.

## Methods

### ver

Returns the version of the workspace service.

#### arguments

none

#### returns

{string} - A version string in semver format.

#### arguments

_none_

### create_workspace

_to do_

### alter_workspace_metadata

_to do_

### clone_workspace

_to do_

### lock_workspace

_to do_

### _get_workspacemeta_

_deprecated - see get_workspace_info_

### get_workspace_info

Get information associated with a workspace.

Takes a single argument of a ```WorkspaceIdentity``` object, and returns a ```workspace_info``` object.

Note: You might find it convenient to use the ```workspaceInfoToObject``` method in ```kb/service/utils``` to convert the workspace_info object into an object with convenient properties. The property names are the same as those in the workspace spec, and are documented in [utils.md](utils.md).

#### arguments

workspaceId {[WorkspaceIdentity](#WorkspaceIdentity)}
: the identity of the workspace to get information about

#### returns

{workpace_info}

#### examples

```
var workspaceId = {
  id: 1052
};
workspace.get_workspace_info(workspaceId)
  .then(function (wsInfo) {
     var workspaceInfoObject = utils.workspaceInfoToObject(wsInfo);
     console.log('This workspace has the name: ' + workspaceInfoObject.name);
  })
  .catch(function (err) {
     console.error('The request to the workspace produced an error: ' + err.error.message);
  });
```

Note:
- assuming a workspace client has been created and kb/service/utils
- the error object returned by service clients is "wrapped" - what you would expect as an error is available as the *error* property.


### get_workspace_description

_to do_

### set_permissions

_to do_

### set_global_permission

_to do_

### set_workspace_description

_to do_

### get_permissions

_to do_

### save_object

_to do_

### save_objects

_to do_

### get_object

_to do_

### get_object_provenance

_to do_

### get_objects

_to do_

### get_object_subset

_to do_

### get_object_history

_to do_

### list_referencing_objects

_to do_

### list_referencing_object_counts

_to do_

### get_referenced_objects

_to do_

### list_workspaces

_to do_

### list_workspace_info

_to do_

### list_workspace_objects

_to do_

### list_objects

_to do_

### get_objectmeta

_to do_

### get_object_info

_deprecated, use instead get_object_info_new_

### get_object_info_new *objectInfoParam*

Get information about objects from the workspace.

Authentication required.

Input parameters for the "get_object_info_new" function.
	
#### arguments

The argument is an object of type *ObjectInfoParam* with the following properties:

##### required

objects {Array of {ObjectIdentity}}
: the objects for which the information should be fetched

##### optional

includeMetadata {intbool} [false]
: include the object metadata in the returned information.

ignoreErrors {intbool} [false]
: Don't throw an exception if an object cannot be accessed; return null for that object's information instead.

> Note that the workspace client, as all service clients, uses integers as booleans; 1 for true, 0 for false. In the documentation we specify this as "intbool" to signal this and avoid confusion.

#### returns

{Array of {object_info}} An array of _object_info_ objects, each of which describes the requested object. The order of returned _object_info_ objects is the same as in the list of requested objects. 

Note that if _ignoreErrors_ is set to true, and if any of the object requests would have thrown an error (not found, invalid format for object identity, permission denied, etc.) then the returned _object_info_ will be _null_. If _ignoreErrors_ is false, then an exception will be thrown for the entire request

> Note that exceptions in workspace or indeed any service client calls are thrown as a generic _Error_ and you may inspect the error message for the cause.

#### Examples

```
// assuming we have a workspace client...
workspace.get_object_info_new({
  objects: [{ref: '123/456/7'}],
  ignoreErrors: false,
  includeMetadata: true
})
  .then(function (objectInfoList) {
    // do something with objectInfoList...
  })
  .catch(function (err) {
     // do something with err
   });
```

### rename_workspace

_to do_

### rename_object

_to do_

### copy_object

_to do_

### revert_object

_to do_

### hide_objects

_to do_

### unhide_objects

_to do_

### delete_objects

_to do_

### undelete_objects

_to do_

### delete_workspace

_to do_

### undelete_workspace

_to do_

### request_module_ownership

_to do_

### register_typespec

_to do_

### register_typespec_copy

_to do_

### release_module

_to do_

### list_modules

_to do_

### list_module_versions

_to do_

### get_module_info

_to do_

### get_jsonschema

_to do_

### translate_from_MD5_types

_to do_

### translate_to_MD5_types

_to do_

### get_type_info

_to do_

### get_all_type_info

_to do_

### get_func_info

_to do_

### get_all_func_info

_to do_

### grant_module_ownership

_to do_

### remove_module_ownership

_to do_

### list_all_types

_to do_

### administer