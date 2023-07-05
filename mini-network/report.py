#!/usr/bin/env python
# coding: utf-8
import json
from typing import List

from xrpl import CryptoAlgorithm
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import ServerInfo

def validate_connection(type: str, client_list: List[str]):
    for i in range(len(client_list)):
        peer_rpc_url = client_list[i]
        peer_client = JsonRpcClient(peer_rpc_url)
        try:
            response = peer_client.request(ServerInfo())
            # print(json.dumps(response.result, sort_keys=True, indent=4))
            peer_state: int = response.result['info']['server_state']
            peer_complete_ledgers: int = response.result['info']['complete_ledgers']
            peer_peer_disconnects: int = response.result['info']['peer_disconnects']
            peer_peers: int = response.result['info']['peers']
            peer_uptime: int = response.result['info']['uptime']
            peer_quorum: int = response.result['info']['validation_quorum']
            peer_validated: bool = False
            peer_seq: int = 0
            if 'validated_ledger' in response.result['info']:
                peer_validated = True
                peer_seq = response.result['info']['validated_ledger']['seq']

            print(f'--------------------{type.upper()}: {peer_rpc_url}------------------------------')
            print(f'NODE {i + 1}: STATE - {peer_state}')
            print(f'NODE {i + 1}: COMPLETED LEDGERS - {peer_complete_ledgers}')
            print(f'NODE {i + 1}: PEER DISCONECTS - {peer_peer_disconnects}')
            print(f'NODE {i + 1}: PEERS - {peer_peers}')
            print(f'NODE {i + 1}: UPTIME - {peer_uptime}')
            print(f'NODE {i + 1}: QUORUM - {peer_quorum}')
            print(f'NODE {i + 1}: VALIDATED - {peer_validated}')
            print(f'NODE {i + 1}: VL SEQUENCE - {peer_seq}')
        except Exception as e:
            print(e)


print('--------------------BURN CHAIN------------------------------')
print('------------------------------------------------------------')
print('------------------------------------------------------------')

BURN_VL_LIST: List[str] = [
    "http://127.0.0.1:5005",
    "http://127.0.0.1:5006"
]
BURN_PEER_LIST: List[str] = [
    "http://127.0.0.1:5007",
]
validate_connection('validator', BURN_VL_LIST)
validate_connection('peer', BURN_PEER_LIST)

print('--------------------MINT CHAIN------------------------------')
print('------------------------------------------------------------')
print('------------------------------------------------------------')

MINT_VL_LIST: List[str] = [
    "http://127.0.0.1:5015",
    "http://127.0.0.1:5016"
]
validate_connection('validator', MINT_VL_LIST)