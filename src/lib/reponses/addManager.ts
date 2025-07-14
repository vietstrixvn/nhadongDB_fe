"use client"; // Đảm bảo đây là client component

// queueLogic.ts
import {useAddManager} from "@/hooks/user/useUsers";
import {BrowseQueueResponse} from "@/types/types"

export const AddManager = () => {
    const { mutate: addManagerMutation } = useAddManager();

    const handleBulkUpdate = (selectedKeys: number[], role: string) => {
        if (selectedKeys.length === 0) {
            console.warn(`No items selected for ${role}.`);
            return;
        }

        const addManager = {
            user: selectedKeys,
            role: role,
        };

        addManagerMutation(addManager, {
            onSuccess: (response: BrowseQueueResponse) => {
                console.log("Response from browseQueue:", response);  // Log phản hồi từ browseQueue
            },
            onError: (error: any) => {
                console.error("Error in browseQueue:", error);  // Log lỗi nếu có
            }
        });
    };


    return { handleBulkUpdate };
};