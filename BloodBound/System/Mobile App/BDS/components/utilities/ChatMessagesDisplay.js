import { FlatList } from 'react-native';

import React from 'react';
import { useDispatch, useSelector } from "react-redux";

import { getMessagesById } from "../../actions/chatMessages";

import { parseDate } from '../../utils/utils';

import Message from '../utilities/Message';

export default function ChatMessagesDisplay(props) {
    const chatIds = useSelector((state) => state.chats[props.chat?._id]?.chatMessages || []);

    const chatMessages = useSelector((state) => chatIds.map(id => state.chatMessages[id]));

    const messageIdArray = useSelector((state) => chatIds.filter(_id => state.chatMessages[_id] == null)); //the slicing ensures that messages already present are not queried for again

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (messageIdArray.length > 0) {
            dispatch(getMessagesById(messageIdArray));
        }
    }, [props.chat]);

    return (
        <FlatList 
            data={[ ...chatMessages ].reverse()}
            renderItem={({ item, index }) =>
                item &&
                <Message 
                    key={item.key}
                    author={item.author} 
                    viewer={props.sender} 
                    message={item.body} 
                    date={parseDate(item.date)}
                /> 
            }
            keyExtractor={(item, index) => item?._id || index}
            inverted={-1} //Will invert the scroll; id-1 appears at bottom of scroll. Thus, make sure latest message is added to front of list.
        />
    )
}