<ElectionConfirmation
  isOpen={isDeleteDialogOpen}
  onClose={() => {
    setIsDeleteDialogOpen(false);
    setSelectedElection(null);
  }}
  onConfirm={handleDeleteElection}
  electionTitle={selectedElection?.title || "this election"}
/>;
