"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useConversation } from "~/hooks/use-converstation";
import { UpdateNickNameRequest } from "~/codegen/data-contracts";
import { toast } from "react-toastify";

interface ModalUpdateNicknameProps {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	conversationId: number;
	participantId: number;
	currentNickname: string;
	token: string;
}

const ModalUpdateNickname: React.FC<ModalUpdateNicknameProps> = ({
	isOpen,
	setIsOpen,
	conversationId,
	participantId,
	currentNickname,
	token,
}) => {
	const [nickname, setNickname] = useState<string>(currentNickname);
	const { updateNickname, loading } = useConversation(0, token);

	const handleUpdateNickname = async () => {
		if (!nickname) {
			toast.error("Nickname cannot be empty.");
			return;
		}

		const data: UpdateNickNameRequest = {
			conversationId,
			participantId,
			nickName: nickname,
		};

		try {
			const response = await updateNickname(data, token);
			if (response) {
				toast.success("Nickname updated successfully!");
				setIsOpen(false);
			} else {
				toast.error("Failed to update nickname.");
			}
		} catch (error) {
			console.error("Error updating nickname:", error);
			toast.error("Failed to update nickname.");
		}
	};

	return (
		<div className={`modal ${isOpen ? "open" : ""}`}>
			<div className="modal-content">
				<h2>Update Nickname</h2>
				<Input
					type="text"
					value={nickname}
					onChange={(e) => setNickname(e.target.value)}
					placeholder="Enter new nickname"
				/>
				<div className="modal-actions">
					<Button onClick={() => setIsOpen(false)} disabled={loading}>
						Cancel
					</Button>
					<Button onClick={handleUpdateNickname} disabled={loading}>
						Update
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ModalUpdateNickname;