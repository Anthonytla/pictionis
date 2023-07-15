interface Props {
  players: any;
}

const Players = ({ players }: Props) => {
  return (
    <View>
      <FlatList data={players} />
    </View>
  );
};

export default Players;
