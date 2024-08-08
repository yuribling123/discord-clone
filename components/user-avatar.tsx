interface UserAvatarProps {
    src: string
}

const UserAvatar = (
    { src }: UserAvatarProps
) => {
    return (
    <img
        src={src}
        alt="User Avatar"
        className="w-8 h-8 rounded-full object-cover "
    />);
}

export default UserAvatar;