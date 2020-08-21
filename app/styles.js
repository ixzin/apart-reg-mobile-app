import React from 'react';
import { StyleSheet } from 'react-native';

const mainStyles = StyleSheet.create({
  background: {
    flex: 1,
    position: 'absolute',
    zIndex: 0,
    top: 0,
    bottom: 0,
    height: null,
    width: null,
    right: 0,
    left: 0
  },
  Mask: {
    backgroundColor: 'black',
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    opacity: 0.75,
    zIndex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    fontSize: 28,
    marginBottom: 20,
    color: 'black',
    height: 60,
    zIndex: 3
  },
  input: {
    color: 'black',
    height: 40,
    borderBottomWidth: 1,
    minWidth: 200,
    borderColor: 'black',
    textAlign: 'left',
    fontSize: 18,
    marginTop: 0,
    marginBottom: 10,
  },
  textarea: {
    color: 'black',
    borderColor: 'black',
    borderWidth: 1,
    minWidth: 200,
    textAlign: 'left',
    fontSize: 18,
    marginTop: 0,
    marginBottom: 10
  },
  primaryButton: {
    backgroundColor: '#ea2e49',
    padding: 10,
    zIndex: 2,
    height: 40,
    minWidth:100,
  },
  secondaryButton: {
    backgroundColor: '#b1b1b1',
    padding: 10,
    zIndex: 2,
    height: 40,
    minWidth:100,
    marginRight:10,
    marginLeft:10
  },
  menuButton: {
    backgroundColor: '#ea2e49',
    padding: 10,
    zIndex: 2,
    width: 200,
    height: 40,
    marginBottom: 10
  },
  errorPopup: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ea2e49',
    padding: 10,
    zIndex: 9
  },
  contentWrapper: {
    flex: 1,
    paddingTop: 60,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  inputBordered: {
    borderWidth: 1,
    borderColor: 'black',
    color: 'black',
    maxHeight: 30,
    minWidth: 50,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 5,
    paddingLeft: 5,
    marginRight: 10
  },
  label: {
    marginTop: 0,
    width: 100
  },
});

export default mainStyles;
