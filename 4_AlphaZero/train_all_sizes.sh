#!/bin/bash

cd /home/thomas-nguyen/Projects/Tic_tac_tool/AlphaZero

for boardSize in {3..15}; do
    session_name="alphazero-size-$boardSize"
    echo "Starting training for board size $boardSize..."
    tmux new-session -s "$session_name" "python -m src.main --boardSize $boardSize"
    echo "Board size $boardSize training complete!"
done

echo "All training sessions completed!"