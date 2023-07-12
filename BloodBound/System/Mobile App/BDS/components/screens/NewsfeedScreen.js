import { StatusBar } from 'expo-status-bar';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import Post from '../utilities/Post';
import EmergencyHighlight from '../utilities/EmergencyHighlight';
import CreateRequest from '../utilities/CreateRequest';
import SearchModal from '../utilities/SearchModal';
//Modal for Notifications button in header.
import NotificationsModal from '../utilities/NotificationsModal';

import React from 'react';
import { useDispatch, useSelector } from "react-redux";

import { searchPosts } from "../../actions/newsfeed";
import { createPost, updatePost } from "../../actions/posts";

export default function NewsfeedScreen(props) {
	const [getPosts, setGetPosts] = React.useState(false);
	const [searchParams, setSearchParams] = React.useState({ filters: '', page: 1, limit: 10 });
	const [modalRequest, setModalRequest] = React.useState(false);
	const [modalHighlight, setModalHighlight] = React.useState(false);
	const [modalSearch, setModalSearch] = React.useState(false);
	const [viewIcons, setViewIcons] = React.useState(true);

	let listViewRef;
	const upButtonHandler = () => {
		listViewRef.scrollToOffset({ offset: 0, animated: true });
	};

	const { posts, prevPage, nextPage } = useSelector((state) => state.newsfeed);

	const user = useSelector((state) => state.user);
    const reported = user?.reportsAgainst?.length > 0;

	const dispatch = useDispatch();

	React.useEffect(() => dispatch(searchPosts(searchParams)), [searchParams, getPosts]);

	const reloadNewsfeed = () => {
		console.log('i am call');
        setSearchParams({ ...searchParams, page: 1, filters: '' });
        setGetPosts(!getPosts); //ensures reloading even on page 1
    }

	//Fulfill post
    const fulfillPost = (post) => {
		console.log('qoi')
        let updates = {};
        if (user.username == post.username) {
            updates = { fulfilledByPoster: true };
        }
        else {
            updates = { fulfilledByDonor: user.username };
        }
        dispatch(updatePost(post._id, updates, user))
        .then((flag) => flag && reloadNewsfeed());
    }

	//Create post
    const onAdd = (post) => dispatch(createPost({ ...post, username: user.username, date: new Date() }, user)).then(() => reloadNewsfeed());

	return (
        <View style={styles.container}>
            <StatusBar backgroundColor='pink'/>
			<View style={styles.feed}>
				<FlatList 
					data={posts}
					renderItem={({ item }) => 
						<Post
							onFulfill={(post) => fulfillPost(post)}
							key={item.key}
							post={item}
						/> 
					}
					keyExtractor={item => item._id}
					ref={(ref) => {
						listViewRef = ref;
					}}
					onEndReachedThreshold={0}
					onEndReached={() => nextPage && setSearchParams({ ...searchParams, limit: searchParams.limit + 10 })}
				/>
				<CreateRequest
					modalVisible={modalRequest}
					setModalVisible={setModalRequest}
					onSubmit={(post) => onAdd(post)}
				/>
				<EmergencyHighlight
					modalVisible={modalHighlight}
					setModalVisible={setModalHighlight}
				/>
				<SearchModal
					modalVisible={modalSearch}
					setModalVisible={setModalSearch}
					setSearchParams={setSearchParams}
				/>
			</View>
			<TouchableOpacity activeOpacity={0.5} onPress={upButtonHandler} style={[styles.scrollViewButton, {bottom: 25}]}>
				<Image source={{ uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/arrow_up.png' }} style={styles.upAddButtonImageStyle} />
			</TouchableOpacity>
			{
				viewIcons &&
					<TouchableOpacity activeOpacity={0.5} style={[styles.scrollViewButton, {bottom: 75}]} onPress={() => setModalRequest(true)}>
						<Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/74/74673.png' }} style={styles.upAddButtonImageStyle} />
					</TouchableOpacity>
			}
			{
				viewIcons && 
					<TouchableOpacity activeOpacity={0.5} style={[styles.scrollViewButton, {bottom: 135}]} onPress={() => setModalHighlight(true)}>
						<Image source={require('../../assets/emergencyIcon.png')} style={styles.emergencyImageStyle} />
					</TouchableOpacity>
			}
			{
				viewIcons && 
					<TouchableOpacity activeOpacity={0.5} style={[styles.scrollViewButton, {bottom: 195}]} onPress={() => setModalSearch(true)}>
						<Image source={{ uri: 'https://img.icons8.com/material/50/000000/search--v1.png' }} style={styles.emergencyImageStyle} />
					</TouchableOpacity>
			}
			<TouchableOpacity activeOpacity={0.5} style={[styles.scrollViewButton, viewIcons ? {bottom: 240} : {bottom: 65} ]} onPress={() => setViewIcons(!viewIcons)}>
				<Image source={{ uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/arrow_up.png' }} style={[styles.upAddButtonImageStyle, viewIcons ? {transform: [{ rotate: '90deg'}, { scale: 0.5 }]} : {transform: [{ rotate: '-90deg'}, { scale: 0.5 }]}]} />
			</TouchableOpacity>
			<NotificationsModal 
                modalVisible={props.modalVisible}
                setModalVisible={props.setModalVisible}
				setNewNotifications={props.setNewNotifications}
            />
        </View>
	);
}

const styles = StyleSheet.create({
	buttonText: {
		top:15,
		fontSize: 16,
		alignSelf:'center'
	},
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
        backgroundColor: 'pink'
	},
	feed: {
		width: '100%',
		marginVertical: 15
	},
	topButton: {
		position: 'absolute',
		bottom: 15,
		right: 15
	},
	topButtonText: {
		alignSelf: 'center'
	},
	scrollViewButton: {
		position: 'absolute',
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		right: 25,
	},
	upAddButtonImageStyle: {
		resizeMode: 'contain',
		width: 30,
		height: 30,
	},
	emergencyImageStyle: {
		resizeMode: 'contain',
		width: 40,
		height: 40,
	},
});
