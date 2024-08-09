import { useSocket } from "@/components/providers/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string"

interface ChatQueryProps {
    queryKey: string;
    apiUrl: string;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
}
export const useChatQuery = ({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
}: ChatQueryProps) => {

    // indicating whether the WebSocket is currently connected
    const { isConnected } = useSocket();

    // constructs a URL with the appropriate query parameters and fetches chat messages from the server
    const fetchMessages = async ({ pageParam = undefined }) => {

        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                //starting point for the next set of data
                cursor: pageParam,
                //specify the context in which the data is being fetched 
                [paramKey]: paramValue,
            },
        }, { skipNull: true });

        // fetching the data from the server
        const res = await fetch(url);
        return res.json();
    };
 

    // set up infinite scrolling or pagination for the chat messages using the useInfiniteQuery hook.
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000,
        initialPageParam: undefined, // Add this line
    });  

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    };



};
