const LOAD_GROUPS='LOAD_GROUPS';
const CHANGE_CURRENT_GROUP='CHANGE_CURRENT_GROUP';

const groups_load=function(loadedGroups) {
  return {
    type: LOAD_GROUPS,
    groups:loadedGroups,
  };
}

const groups_change_current=function(idCurrentGroup) {
  return {
    type: CHANGE_CURRENT_GROUP,
    idCurrentGroup:idCurrentGroup,
  };
}

export {
  groups_load, LOAD_GROUPS,
  groups_change_current,CHANGE_CURRENT_GROUP,
}

