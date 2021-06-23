/*
Author : Siddharth Kumar Yadav
*/

import React from "react";
import {
  Animated,
  Button,
  Image,
  Keyboard,
  FlatList,
  Text,
  View,
  ScrollView,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Toast,
  ToastAndroid,
} from "react-native";
import RNFetchBlob from "rn-fetch-blob";

import DoubleClick from "react-native-double-tap";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRefresh, setIsRefresh] = React.useState(false);
  const [URLS, setURLS] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [suggestionsShow, setSuggestionsShow] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [isPaginationControl, setIsPaginationControl] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);

  React.useEffect(
    () =>
      ToastAndroid.show(
        "Created by : Siddharth Kumar Yadav",
        ToastAndroid.LONG
      ),
    []
  );

  React.useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => {
      setIsPaginationControl(false);
      setSuggestionsShow(true);
    });
    Keyboard.addListener("keyboardDidHide", () => {
      if (URLS.length !== 0) {
        setIsPaginationControl(true);
      }
      setSuggestionsShow(false);
    });

    return () => {
      Keyboard.removeListener("keyboardDidShow", () => console.log("shown"));
      Keyboard.removeListener("keyboardDidHide", () => console.log("hidden"));
    };
  }, []);

  React.useEffect(async () => {
    try {
      const suggestionsResp = await AsyncStorage.getItem("suggestions");
      if (suggestionsResp !== null) {
        // console.log(JSON.parse(suggestionsResp));
        setSuggestions(JSON.parse(suggestionsResp));
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleNewSuggestion = async (e) => {
    if (e.trim() === "") {
      return;
    }
    const newSuggestionArray = suggestions;

    if (newSuggestionArray.length >= 10) {
      // console.log(newSuggestionArray.length);
      newSuggestionArray.splice(0, 1);
    }
    if (newSuggestionArray.indexOf(e) !== -1) {
      const index = newSuggestionArray.indexOf(e);
      newSuggestionArray.splice(index, 1);
    }
    newSuggestionArray.push(String(e));
    try {
      const response = await AsyncStorage.setItem(
        "suggestions",
        JSON.stringify(newSuggestionArray)
      );
      setSuggestions(newSuggestionArray);
    } catch (err) {
      console.log(err);
    }
  };

  function SearchPhotos(q, page = 1) {
    let clientId = "BHcBkB7kgcTM40SLqVz12BRIAEvXP9k6YNlONSodSuQ";
    let url =
      "https://api.unsplash.com/search/photos/?client_id=" +
      clientId +
      "&query=" +
      q +
      "&page=" +
      page;
    setIsLoading(true);

    fetch(url)
      .then(function (data) {
        return data.json();
      })
      .then(function (data) {
        // console.log(data);
        let photos = [];
        data.results.forEach((photo) => {
          photos.push(String(photo.urls.regular));
        });
        if (photos.length === 0) {
          ToastAndroid.show("No Results Found", 100);
          setIsPaginationControl(false);
          setURLS([]);
          setIsLoading(false);
          setPageNumber(1);
          return;
        } else {
          setURLS(photos);
          // console.log(URLS);
          setTimeout(() => {
            setIsLoading(false);
            setIsPaginationControl(true);
            setIsRefresh(false);
          }, 2000);
        }
      })
      .catch((err) => {
        console.log(err);
        ToastAndroid.show("API Limit Exhaushted", 100);
        setIsLoading(false);
        setIsRefresh(false);
      })
      .finally(() => {});
  }

  return (
    <>
      <View style={styles.header}>
        <StatusBar
          animated={true}
          backgroundColor="dodgerblue"
          hidden={false}
        />
        <Text style={styles.appName}>Photo Gallery Application v2.0</Text>
      </View>
      <View style={styles.main}>
        <View style={styles.menu}>
          <TextInput
            editable={true}
            style={styles.input}
            value={query}
            onChangeText={(e) => setQuery(e)}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => {
              SearchPhotos(query);
              setPageNumber(1);
              setIsLoading(!isLoading);
              Keyboard.dismiss();
              handleNewSuggestion(query);
            }}
          >
            <Text style={styles.searchButton}>Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.resultScreen}>
          {isLoading && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="dodgerblue" />
              <Text style={{ marginLeft: "39%", marginTop: 10 }}>
                Please wait...
              </Text>
            </View>
          )}

          {!isLoading && (
            <Animated.FlatList
              showsVerticalScrollIndicator={false}
              data={URLS}
              keyExtractor={(i) => i}
              removeClippedSubviews={true} // Unmount components when outside of window
              initialNumToRender={2} // Reduce initial render amount
              maxToRenderPerBatch={1} // Reduce number in each render batch
              updateCellsBatchingPeriod={100} // Increase time between renders
              windowSize={7} // Reduce the window size
              inverted={false}
              onRefresh={() => {
                setIsRefresh(true);
                SearchPhotos(query, pageNumber);
              }}
              refreshing={isRefresh}
              renderItem={({ item, index }) => {
                return (
                  <DoubleClick
                    doubleTap={() => {
                     

                      // const IMG_PATH=item;

                      const downloadImage = (IMG_URL) => {
                        // console.log(IMG_URL);
                        let data = new Date();
                        // let ext=getExtension(IMG_URL);
                        // ext='.'+ext[0]
                        //we explicitely assinging because image does not have extension in unsplash from filename
                        let ext = ".png";
                        // console.log(ext);
                        // Get conig and fd from blb fetch
                        const { config, fs } = RNFetchBlob;
                        // console.log(fs.dirs);
                        let PictureDir =
                          fs.dirs.PictureDir + "/PhotoGalleryApp";
                        let options = {
                          fileCache: true,
                          addAndroidDownloads: {
                            useDownloadManager: true,
                            notification: true,
                            path:
                              PictureDir +
                              "/image_" +
                              Math.floor(
                                data.getTime() + data.getSeconds() / 2
                              ) +
                              ext,
                            description: "Image",
                          },
                        };
                         ToastAndroid.show(
                        "Downloading ...",
                        ToastAndroid.SHORT
                      );
                        config(options)
                          .fetch("GET", IMG_URL)
                          .then((res) => {

                            // console.log("res", JSON.stringify(res));
                            ToastAndroid.show(
                              "Image Downloaded",
                              ToastAndroid.SHORT
                            );
                          })
                          .catch(err=>ToastAndroid.show('Download Failed',ToastAndroid.SHORT))
                      };
                      const getExtension = (filename) => {
                        return /[.]/.exec(filename)
                          ? /[^.]+$/.exec(filename)
                          : undefined;
                      };

                      const checkPermision = async () => {
                        if (Platform.OS == "ios") {
                          downloadImage(item);
                        } else {
                          try {
                            const granted = await PermissionsAndroid.request(
                              PermissionsAndroid.PERMISSIONS
                                .WRITE_EXTERNAL_STORAGE,
                              {
                                title: "Storage Premission Required",
                                message: "App need storage permission",
                              }
                            );

                            if (
                              granted === PermissionsAndroid.RESULTS.GRANTED
                            ) {
                              // console.log("GRANTED");
                              downloadImage(item);
                            } else {
                              alert("Storage Permissions not granted");
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      };

                      checkPermision();
                    }}
                    delay={200}
                  >
                    <View style={styles.card}>
                      <Image
                        source={{
                          uri: item,
                        }}
                        style={StyleSheet.absoluteFillObject}
                        resizeMode="cover"
                        tintColor=""
                      />
                    </View>
                  </DoubleClick>
                );
              }}
            />
          )}
        </View>
        {isPaginationControl && (
          <View style={styles.pagination__control}>
            {pageNumber > 1 && (
              <TouchableOpacity
                onPress={() => {
                  setPageNumber((e) => e - 1);
                  SearchPhotos(query, pageNumber);
                }}
              >
                <Text style={styles.pagination__nextPage}>
                  &laquo; Previous
                </Text>
              </TouchableOpacity>
            )}
            <Text style={styles.pagination__cell}>{pageNumber}</Text>
            <TouchableOpacity
              onPress={() => {
                setPageNumber((e) => e + 1);
                SearchPhotos(query, pageNumber);
              }}
            >
              <Text style={styles.pagination__nextPage}>Next &raquo;</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {suggestionsShow && (
        <View style={styles.footer}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {suggestions &&
              suggestions.map((x, i, s) => (
                <TouchableOpacity
                  key={x}
                  onPress={async () => {
                    await setQuery(s[s.length - i - 1]);
                    SearchPhotos(s[s.length - i - 1], 1);
                    Keyboard.dismiss();
                  }}
                >
                  <Text style={styles.chip}>{s[s.length - i - 1]}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}

      {/* <TouchableOpacity>
                                         <Text style={styles.downloadButton}>Download</Text>
                                       </TouchableOpacity>*/}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "dodgerblue",
    padding: 20,
  },
  appName: {
    color: "white",
  },
  main: {
    backgroundColor: "white",
    flex: 1,
  },
  menu: {
    flexDirection: "row",
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    color: "grey",
    margin: 20,
    marginRight: -1,
    borderRadius: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexGrow: 1,
    backgroundColor: "#eee",
  },
  searchButton: {
    backgroundColor: "dodgerblue",
    padding: 10,
    justifyContent: "center",
    margin: 20,
    marginLeft: 0,
    color: "white",
    borderWidth: 1,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderColor: "#2980b9",
  },
  loader: {
    flex: 0.9,
    justifyContent: "center",
  },
  resultScreen: { flex: 1, margin: 10, marginTop: 0, padding: 5 },
  card: {
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    padding: 10,
    height: 300,
    backgroundColor: "#eee",
    justifyContent: "flex-end",
  },
  downloadButton: {
    backgroundColor: "#3498db",
    borderWidth: 2,
    borderColor: "#2980b9",
    width: 100,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    color: "white",
    borderRadius: 10,
    textAlign: "center",
  },
  pagination__control: {
    backgroundColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  pagination__cell: {
    backgroundColor: "white",
    color: "black",
    padding: 5,
    borderWidth: 2,
    borderRadius: 40,
    textAlign: "center",
    borderColor: "#eee",
    paddingLeft: 30,
    paddingRight: 30,
  },
  pagination__nextPage: {
    paddingTop: 5,
  },
  footer: {
    backgroundColor: "#eee",
    margin: 10,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 0,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    flexDirection: "row",
  },
  chip: {
    backgroundColor: "#eee",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
    padding: 5,
    marginBottom: 5,
    marginTop: 3,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: "center",
    color: "black",
  },
});
export default React.memo(App);
